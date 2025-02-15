const restana = require('restana')();
const { checkRegisterUserParams } = require('./register.middleware');
const { registerUser } = require('./register.controller');

const router = restana.newRouter();

router.post(
  '/',
  checkRegisterUserParams,
  registerUser,
);

module.exports = router;
