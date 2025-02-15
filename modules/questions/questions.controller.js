const { errorResponse, successResponse } = require("../../utils/response/response.handler");
const { SUCCESS_MESSAGES } = require("./questions.constants");
const { createQuestionHelper } = require("./questions.helper");

const createQuestion = async (req, res) => {
  try {
    const {
      question,
      options = [],
    } = req.body;
    const { userId } = req;
    const data = await createQuestionHelper({
      userId,
      question,
      options,
    });
    return successResponse({
      res,
      data,
      message: SUCCESS_MESSAGES.QUESTION_CREATED_SUCCESS,
    });
  } catch (error) {
    return errorResponse({
      res, error,
    });
  }
}

module.exports = {
  createQuestion,
};
