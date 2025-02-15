const { USER_SESSION_STATUS } = require('../mongodb/constants/constants');
const {
  UserSessionModel,
  QuestionsModel,
  GameModel,
} = require('../mongodb/models');
const { MAX_QUESTION_PER_GAME } = require('../utils/constants/constants');
const {
  throwValidationError,
} = require('../utils/response/response.handler');

const joinSession = async ({ sessionId }) => {
  const findClause = { _id: sessionId };
  const updateClause = {
    status: USER_SESSION_STATUS.WAITING,
  };
  const sessionDetails = await UserSessionModel.findOneAndUpdate(findClause, { $set: updateClause }).lean();
  if (!sessionDetails) {
    throwValidationError({
      message: 'Invalid Session Id',
    });
  }
  const {
    userId,
  } = sessionDetails;
  return { userId };
}

const sendNextQuestion = async ({ gameId }) => {
  const game = await GameModel.findById(gameId).lean();
  const { currentQuestion, questions, players } = game;
  const nextQuestionId = questions[currentQuestion + 1];
  const [question] = await Promise.all([
    QuestionsModel.findById(nextQuestionId, { question: 1, 'options.optionText': 1, 'options._id': 1 }).lean(),
    GameModel.updateOne({ _id: gameId }, { $set: { currentQuestion: currentQuestion + 1 } }),
  ]);
  players.forEach((player) => {
    global.socketClient.to(player.sessionId.toString()).emit('questionSend', question);
  });
}

const createGame = async ({ players = [] }) => {
  if (!players.length) {
    return;
  }
  const totalQuestions = MAX_QUESTION_PER_GAME;
  const questions = await QuestionsModel.aggregate([
    { $sample: { size: totalQuestions } },
    { $project: { _id: 1 } }
  ]);
  const questionIds = questions.map(({ _id }) => _id);
  const game = new GameModel({
    players,
    questions: questionIds,
    currentQuestion: -1,
    totalQuestions,
    optionsSelected: [],
  });
  const { _id: gameId } = game;
  const playerSessionIds = players.map((player) => player.sessionId);
  await Promise.all([
    game.save(),
    UserSessionModel.updateMany({ _id: { $in: playerSessionIds } }, { $set: { gameId } }),
  ]);
  players.forEach((player) => {
    global.socketClient.to(player.sessionId.toString()).emit('init', { gameId });
  });
  sendNextQuestion({ gameId });
};

const startGameIfOpponentAvailable = async ({ userId, sessionId }) => {
  const findClause = {
    userId: { $ne: userId },
    status: USER_SESSION_STATUS.WAITING,
  };
  const opponent = await UserSessionModel.findOne(findClause).lean();
  if (!opponent) {
    return;
  }
  const opponentSessionId = opponent._id.toString();
  const opponentUserId = opponent.userId.toString();
  await UserSessionModel.updateMany(
    { _id: { $in: [sessionId, opponentSessionId] } },
    { $set: { status: USER_SESSION_STATUS.PLAYING } },
  );
  await createGame({
    players: [
      { sessionId, userId },
      { sessionId: opponentSessionId, userId: opponentUserId },
    ],
  });
};

const findWinner = async ({ questionIds, optionsSelected, players }) => {
  const questions = await QuestionsModel.find({ _id: { $in: questionIds } }, { options: 1 }).lean();
  const questionRightOptionMap = questions.reduce((acc, question) => {
    const questionId = question._id.toString();
    const { options } = question;
    const rightOption = options.find(option => option.isRight);
    acc[questionId] = rightOption._id.toString();
    return acc;
  }, {});
  const userScoresMap = new Map();
  players.forEach((player) => {
    userScoresMap[player.userId.toString()] = {
      rightAnswersCount: 0,
      wrongAnswersCount: 0
    };
  });
  let maxScore = 0;
  optionsSelected.forEach((option) => {
    const { questionId, optionId, userId } = option;
    if (questionRightOptionMap[questionId.toString()] === optionId.toString()) {
      userScoresMap[userId.toString()].rightAnswersCount++;
      maxScore = Math.max(maxScore, userScoresMap[userId.toString()].rightAnswersCount);
    } else {
      userScoresMap[userId.toString()].wrongAnswersCount++;
    }
  });
  const winnerUserIds = [];
  players.forEach((player) => {
    Object.assign(player, userScoresMap[player.userId.toString()]);
    if (player.rightAnswersCount === maxScore) {
      winnerUserIds.push(player.userId);
    }
  });
  return { winnerUserId: winnerUserIds[0] };
}

const findWinnerAndEndGame = async (gameObject) => {
  const {
    optionsSelected,
    questions,
    players,
  } = gameObject;
  const { winnerUserId } = await findWinner({ questionIds: questions, optionsSelected, players, });
  const sessionIds = players.map(player => player.sessionId.toString());
  await Promise.all([
    GameModel.updateOne({ _id: gameObject._id }, { $set: { players, winnerUserId } }),
    UserSessionModel.updateMany({ _id: { $in: sessionIds } }, { $set: { status: USER_SESSION_STATUS.WAITING } }),
  ]);
  players.forEach((player) => {
    const isWinner = player.userId === winnerUserId;
    const message = isWinner ? 'You won the game' : 'Better Luck,';
    global.socketClient.to(player.sessionId.toString()).emit('end', { isWinner, message });
  });
}

const saveUserResponse = async ({
  gameId, optionId, userId, questionId,
}) => {
  const game = await GameModel.findOneAndUpdate(
    { _id: gameId },
    {
      $push: {
        optionsSelected: { questionId, optionId, userId },
      },
    }, { new: true }).lean();

  const attemptedUserIds = new Set();
  const { optionsSelected = [] } = game;
  optionsSelected.forEach((optionSelected) => {
    if (optionSelected.questionId.toString() === questionId) {
      attemptedUserIds.add(optionSelected.userId.toString());
    }
  });
  const isALlPlayersHasAttempted = Array.from(attemptedUserIds).length === game.players.length;
  if (!isALlPlayersHasAttempted) {
    return;
  }
  const isLastQuestion = !(game.currentQuestion + 1 - game.totalQuestions);
  if (isLastQuestion) {
    await findWinnerAndEndGame(game);
  } else {
    await sendNextQuestion({ gameId });
  }
};

const endUserSession = async ({ sessionId }) => {
  await UserSessionModel.updateOne({ _id: sessionId }, { $set: { status: USER_SESSION_STATUS.FINISHED } });
}

module.exports = {
  joinSession,
  startGameIfOpponentAvailable,
  saveUserResponse,
  endUserSession,
};