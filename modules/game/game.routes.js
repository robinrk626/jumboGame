const restana = require('restana')();
const { startGame } = require('./game.controller');

const router = restana.newRouter();

router.post(
  '/start',
  startGame,
);

module.exports = router;
