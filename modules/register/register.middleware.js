const { isValidMobileNumber } = require("../../utils/common-utils/common-utils");
const { errorResponse, throwValidationError } = require("../../utils/response/response.handler");
const { VALIDATION_MESSAGES } = require("./register.constants");

const checkRegisterUserParams = (req, res, next) => {
  try {
    const {
      name,
      mobileNumber,
      password,
    } = req.body;
    if (!name) {
      throwValidationError({ message: VALIDATION_MESSAGES.NAME_MISSING });
    }
    if (!mobileNumber) {
      throwValidationError({ message: VALIDATION_MESSAGES.MISSING_MOBILE_NUMBER });
    }
    if (!isValidMobileNumber(mobileNumber)) {
      throwValidationError({ message: VALIDATION_MESSAGES.INVALID_MOBILE_NUMBER });
    }
    if (!password) {
      throwValidationError({ message: VALIDATION_MESSAGES.MISSING_PASSWORD });
    }
    return next();
  } catch (error) {
    return errorResponse({
      res, error,
    });
  }
}

module.exports = {
  checkRegisterUserParams,
}