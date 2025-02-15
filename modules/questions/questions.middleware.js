const { errorResponse, throwValidationError } = require("../../utils/response/response.handler");
const { VALIDATION_MESSAGES } = require("./questions.constants");

const validateCreateQuestionParams = (req, res, next) => {
  try {
    const {
      question,
      options = [],
    } = req.body;
    if (!question) {
      throwValidationError({ message: VALIDATION_MESSAGES.QUESTION_MISSING });
    }
    if (!options || !options.length) {
      throwValidationError({ message: VALIDATION_MESSAGES.OPTIONS_MISSING });
    }
    let isRightOptionSelected = false;
    options.forEach((option) => {
      if (!option.optionText) {
        throwValidationError({ message: VALIDATION_MESSAGES.INVALID_OPTIONS });
      }
      if (option.isRight) {
        isRightOptionSelected = true;
      }
    })
    if (!isRightOptionSelected) {
      throwValidationError({ message: VALIDATION_MESSAGES.CORRECT_OPTION_NOT_SELECTED });
    }
    return next();
  } catch (error) {
    return errorResponse({
      res, error,
    });
  }
}

module.exports = {
  validateCreateQuestionParams,
}