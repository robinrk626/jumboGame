const { errorResponse, successResponse } = require("../../utils/response/response.handler");
const { SUCCESS_MESSAGES } = require("./register.constants");
const { registerUserHelper } = require("./register.helper");

const registerUser = async (req, res) => {
  try {
    const {
      name,
      mobileNumber,
      password,
    } = req.body;
    const data = await registerUserHelper({
      name,
      mobileNumber,
      password,
    });
    return successResponse({
      res,
      data,
      message: SUCCESS_MESSAGES.USER_REGISTERED,
    });
  } catch (error) {
    return errorResponse({
      res, error,
    });
  }
}

module.exports = {
  registerUser,
};
