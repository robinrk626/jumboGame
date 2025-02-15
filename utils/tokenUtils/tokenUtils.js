const { UserModel } = require("../../mongodb/models");
const { generateToken } = require("../jwt/jwt.utils");

const createAndSaveTokenInDb = async ({ userId }) => {
  if (!userId) {
    return '';
  }
  const token = generateToken({ userId });
  await UserModel.updateOne({ _id: userId }, { $set: { token } });
  return token;
}

module.exports = {
  createAndSaveTokenInDb,
};
