const { QuestionsModel } = require("../../mongodb/models");

const createQuestionHelper = async ({
  userId,
  question,
  options,
}) => {
  const newQuestion = new QuestionsModel({
    question,
    options,
    createdBy: userId,
  });
  await newQuestion.save();
}

module.exports = {
  createQuestionHelper,
};
