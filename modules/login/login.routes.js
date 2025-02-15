const restana = require('restana')();
const { checkLoginParams } = require('./login.middleware');
const { checkLogin } = require('./login.controller');

const router = restana.newRouter();

router.post(
  '/',
  checkLoginParams,
  checkLogin,
);

module.exports = router;
