const restana = require('restana');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const {
  errorResponse,
  STATUS_CODES: { STATUS_CODE_FAILURE, STATUS_CODE_DATA_NOT_FOUND },
} = require('./utils/response/response.handler');
const routes = require('./routes');
const { createServer } = require('http');
const { getConfig } = require('./config');
const {
  init: mongodbInit
} = require('./mongodb');
const config = getConfig();
const {
  authMiddleware,
} = require('./middlewares/authMiddleware');
const { connectSocket } = require('./socket/socketEvents.js');

const DEFAULT_PORT = 3000;

const app = restana();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());
app.use(cors());
app.use(compression());

app.use('/auth', authMiddleware)
routes(app);

app.use((req, res) => errorResponse({
  code: STATUS_CODE_DATA_NOT_FOUND,
  res,
  message: 'Route not found',
}));

app.use((error, req, res) => errorResponse({
  code: STATUS_CODE_FAILURE,
  res,
  error,
  message: error.message,
}));

const server = createServer(app);
connectSocket(server);

const port = config.PORT || DEFAULT_PORT;
server.listen(port, async () => {
  try {
    mongodbInit(config.database);
    console.log(`Server started at port ${port}`);
  } catch (err) {
    console.error("Failed to start server:", err);
  }
});