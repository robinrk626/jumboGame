const restana = require('restana')();
const { checkHealth } = require('./health.controller');

const router = restana.newRouter();

router.post(
  '/',
  checkHealth,
);

module.exports = router;
