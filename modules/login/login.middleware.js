const { isValidMobileNumber } = require("../../utils/common-utils/common-utils");
const { errorResponse, throwValidationError } = require("../../utils/response/response.handler");
const { VALIDATION_MESSAGES } = require("./login.constants");

const checkLoginParams = (req, res, next) => {
  try {
    const {
      mobileNumber,
      password,
    } = req.body;
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
  checkLoginParams,
}