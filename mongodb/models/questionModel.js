const mongoose = require('mongoose');
const userModel = require('./userModel');
const { Schema } = mongoose;

const optionSchema = new Schema({
  optionText: { type: String, required: true },
  isRight: { type: Boolean, default: false },
});

const QuestionSchema = new Schema({
  question: { type: String, required: true },
  options: [optionSchema],
  createdBy: {
    type: Schema.Types.ObjectId, required: true, ref: userModel.collection.name,
  }
}, { timestamps: true });

module.exports = mongoose.model('questions', QuestionSchema, 'questions');
