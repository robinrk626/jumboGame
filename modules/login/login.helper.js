const { UserModel } = require("../../mongodb/models");
const { throwValidationError } = require("../../utils/response/response.handler");
const { createAndSaveTokenInDb } = require("../../utils/tokenUtils/tokenUtils");
const { VALIDATION_MESSAGES } = require("./login.constants");

const checkLoginHelper = async ({
  mobileNumber,
  password,
}) => {
  const findClause = {
    mobileNumber,
  }
  const user = await UserModel.findOne(findClause);
  if (!user) {
    throwValidationError({
      message: VALIDATION_MESSAGES.INVALID_MOBILE_NUMBER,
    });
  }
  const isPasswordMatched = user.comparePassword(password);
  if (!isPasswordMatched) {
    throwValidationError({ message: VALIDATION_MESSAGES.WRONG_PASSWORD });
  }
  const { _id: userId } = user;
  const token = await createAndSaveTokenInDb({userId});
  return { token };
}

module.exports = {
  checkLoginHelper,
};
