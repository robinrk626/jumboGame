const mongoose = require('mongoose');
const userModel = require('./userModel');
const { USER_SESSION_STATUS } = require('../constants/constants');

const UserSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, required: true, ref: userModel.collection.name,
  },
  status: {
    type: String,
    enum: Object.values(USER_SESSION_STATUS),
    default: USER_SESSION_STATUS.CREATED,
  },
  gameId: {
    type: mongoose.Schema.Types.ObjectId, default: null,
  },
}, { timestamps: true });


module.exports = mongoose.model('userSession', UserSessionSchema, 'userSession');