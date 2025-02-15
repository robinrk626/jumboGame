const { successResponse } = require("../../utils/response/response.handler");

const checkHealth = async (req, res) => {
  successResponse({
    res,
    data: {},
    message: 'Working'
  });
}

module.exports = {
  checkHealth,
};
