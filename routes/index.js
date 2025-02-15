const loginRoutes = require('../modules/login/login.routes');
const registerRoutes = require('../modules/register/register.routes');
const healthRoutes = require('../modules/health/health.routes');

module.exports = (app) => {
  app.use('/health',healthRoutes);
  app.use('/login',loginRoutes);
  app.use('/register',registerRoutes);
}