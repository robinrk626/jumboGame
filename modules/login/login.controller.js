const { errorResponse, successResponse } = require("../../utils/response/response.handler");
const { SUCCESS_MESSAGES } = require("./login.constants");
const { checkLoginHelper } = require("./login.helper");

const checkLogin = async (req, res) => {
  try {
    const {
      mobileNumber,
      password,
    } = req.body;
    const data = await checkLoginHelper({
      mobileNumber,
      password,
    });
    return successResponse({
      res,
      data,
      message: SUCCESS_MESSAGES.LOGIN_SUCCESS
    });
  } catch (error) {
    return errorResponse({
      res, error,
    });
  }
}

module.exports = {
  checkLogin,
};
