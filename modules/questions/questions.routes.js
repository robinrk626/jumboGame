const restana = require('restana')();
const { createQuestion } = require('./questions.controller');
const { validateCreateQuestionParams } = require('./questions.middleware');

const router = restana.newRouter();

router.post(
  '/',
  validateCreateQuestionParams,
  createQuestion,
);

module.exports = router;
