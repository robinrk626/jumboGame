const { UserModel } = require("../mongodb/models");
const { decodeToken } = require("../utils/jwt/jwt.utils");
const { errorResponse, STATUS_CODES, throwValidationError } = require("../utils/response/response.handler");

const validateToken = async ({ token, userId }) => {
  const isValidToken = await UserModel.findOne({ _id: userId, token }).lean();
  if (!isValidToken) {
    throwValidationError({
      code: STATUS_CODES.STATUS_CODE_UNAUTHORIZED,
      message: 'Invalid Token',
    });
  }
}

const authMiddleware = async (req, res, next) => {
  try {
    const { authorization: token } = req.headers;
    if (!token) {
      throwValidationError({
        code: STATUS_CODES.STATUS_CODE_UNAUTHORIZED,
        message: 'Token Missing',
      });
    }
    const decodedToken = decodeToken(token);
    if (!decodedToken || !decodedToken.userId) {
      return throwValidationError({
        code: STATUS_CODES.STATUS_CODE_UNAUTHORIZED,
        message: 'Invalid Token',
      });
    }
    const { userId } = decodedToken;
    await validateToken({ userId, token });
    req.userId = userId;
    return next();
  } catch (error) {
    return errorResponse({
      res,
      error,
    });
  }
};

module.exports = {
  authMiddleware,
};