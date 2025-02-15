const loginRoutes = require('../modules/login/login.routes');
const registerRoutes = require('../modules/register/register.routes');
const healthRoutes = require('../modules/health/health.routes');
const gameRoutes = require('../modules/game/game.routes');
const questionsRoutes = require('../modules/questions/questions.routes');

module.exports = (app) => {
  app.use('/health', healthRoutes);
  app.use('/login', loginRoutes);
  app.use('/register', registerRoutes);
  app.use('/auth/game', gameRoutes);
  app.use('/auth/questions', questionsRoutes);
}