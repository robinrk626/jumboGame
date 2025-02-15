const { errorResponse, successResponse } = require("../../utils/response/response.handler");
const { SUCCESS_MESSAGES } = require("./game.constants");
const { startNewGameSession } = require("./game.helper");

const startGame = async (req, res) => {
  try {
    const { userId } = req;
    const data = await startNewGameSession({
      userId,
    });
    return successResponse({
      res,
      data,
      message: SUCCESS_MESSAGES.NEW_SESSION_STARTED,
    });
  } catch (error) {
    return errorResponse({
      res, error,
    });
  }
}

module.exports = {
  startGame,
};
