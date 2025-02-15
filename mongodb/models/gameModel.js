const mongoose = require("mongoose");
const userModel = require("./userModel");
const userSessionModel = require("./userSessionModel");
const QuestionModel = require("./questionModel");
const { Schema } = mongoose;

const PlayerSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId, required: true, ref: userModel.collection.name,
  },
  sessionId: {
    type: Schema.Types.ObjectId, required: true, ref: userSessionModel.collection.name,
  },
  stats: {
    rightAnswersCount: { type: Number, default: 0 },
    wrongAnswersCount: { type: Number, default: 0 },
  },
}, { _id: false });

const GameSchema = new Schema({
  players: [PlayerSchema],
  questions: [{
    type: Schema.Types.ObjectId, required: true, ref: QuestionModel.collection.name,
  }],
  optionsSelected: [{
    questionId: {
      type: Schema.Types.ObjectId, required: true, ref: QuestionModel.collection.name,
    },
    optionId: {
      type: Schema.Types.ObjectId, required: true,
    },
    userId: {
      type: Schema.Types.ObjectId, required: true, ref: userModel.collection.name,
    },
  }],
  currentQuestion: {
    type: Number, default: 0,
  },
  totalQuestions: {
    type: Number, required: true,
  },
  winnerUserId: {
    type: Schema.Types.ObjectId, default: null, ref: userModel.collection.name,
  },
}, { timestamps: true });

module.exports = mongoose.model('game', GameSchema, 'game');