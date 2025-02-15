const { UserModel } = require("../../mongodb/models");
const { throwValidationError } = require("../../utils/response/response.handler");
const { createAndSaveTokenInDb } = require("../../utils/tokenUtils/tokenUtils");
const { VALIDATION_MESSAGES } = require("./register.constants");

const registerUserHelper = async ({
  name,
  mobileNumber,
  password,
}) => {

  const isUserPresent = await UserModel.findOne({ mobileNumber }).lean();
  if (isUserPresent) {
    throwValidationError({
      message: VALIDATION_MESSAGES.MOBILE_NUMBER_USED,
    });
  }
  const user = new UserModel({
    name,
    mobileNumber,
    password,
  });
  await user.save();
  const userId = user._id;
  const token = await createAndSaveTokenInDb({ userId });
  return { token };
}

module.exports = {
  registerUserHelper,
};
