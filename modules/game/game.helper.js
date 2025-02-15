const { USER_SESSION_STATUS } = require("../../mongodb/constants/constants");
const { UserSessionModel } = require("../../mongodb/models");

async function finishUserPreviousSessions({
  userId,
}) {
  const findClause = {
    userId,
  };
  const updateClause = {
    status: USER_SESSION_STATUS.FINISHED,
    gameId: null,
  };
  await UserSessionModel.updateMany(findClause, { $set: updateClause });
}

const startNewGameSession = async ({
  userId
}) => {
  await finishUserPreviousSessions({ userId });
  const newSession = new UserSessionModel({
    userId,
  });
  await newSession.save();
  const sessionId = newSession._id;
  return { sessionId };
}

module.exports = {
  startNewGameSession,
};
