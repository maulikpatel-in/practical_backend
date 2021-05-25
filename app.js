const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const uuid = require('uuid');
const cors = require('cors');
const helmet = require('helmet');
const requestIp = require('request-ip');
const compression = require('compression');
const createHttpError = require('http-errors');
require('dotenv').config();
require('dotenv-safe').config({
  allowEmptyValues: true
});
const config = require('config');

const logger = require('./utils/logger');
const db = require('./utils/db');
const routes = require('./routes');

const app = express();

/**
 * morgan setup for request id
 * ref: https://gist.github.com/cgmartin/913bb12097ff07132597
 */
app.use((req, _res, next) => {
  req.id = uuid.v4();
  next();
});
app.use(compression());
app.use(cors());
app.use(helmet());

morgan.token('id', req => req.id);
morgan.token('ip', req => requestIp.getClientIp(req));

app.use(morgan(config.morganFormat, { stream: logger.stream }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

db.getConnection(config.db);

app.use((req, res, next) => {
  let res_code = '';
  if (req.query.res_code) {
    res_code = req.query.res_code;
  }
  res.res_code = res_code;

  let origin = '*'; // Default Origin
  if (req.headers.origin) {
    origin = req.headers.origin;
  }

  res.header('Access-Control-Allow-Origin', origin);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Token, Timestamp, X-Requested-With, Authorization'
  );
  res.header('Access-Control-Allow-Credentials', true);

  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

routes.initialize(app);

// 404 route
app.all('/*', req => {
  throw createHttpError(404, `Cannot ${req.method.toUpperCase()} ${req.path}`);
});

// handle unknown errors here
app.use((err, req, res, _next) => {
  const errorResponse = {
    error: true,
    message: 'Unknown Error',
    statusCode: 500
  };

  // create a message to log to the console
  const consoleMessage = {
    req: `${req.method} ${req.protocol}://${req.get('host')}${req.originalUrl}`,
    message: 'Unknown Error',
    statusCode: 500
  };

  let message = err && err.message;
  if (!message && typeof err === 'string') {
    message = err;
  }
  if (message) {
    if (err && err.expose !== false && message) {
      errorResponse.message = message;
    }
    consoleMessage.message = message;
  }

  if (err && err.statusCode) {
    errorResponse.statusCode = err.statusCode;
    consoleMessage.statusCode = err.statusCode;
  }

  if (err && err.stack) {
    consoleMessage.stack = err.stack;
    if (config.includeErrorStackTrace) {
      errorResponse.stack = err.stack;
    }
  }

  if (err && err.data) {
    errorResponse.data = err.data;
    consoleMessage.data = err.data;
  }

  const keys = ['req', 'statusCode', 'message', 'stack'];
  const formattedConsoleMessage = `Unhandled Error:\n${keys
    .map(key => `  ${key}: ${consoleMessage[key]}`)
    .join('\n')}`;
  logger.error(formattedConsoleMessage);

  return res.status(errorResponse.statusCode).send(errorResponse);
});

const listeningPort = process.env.PORT ? process.env.PORT : 9001;

const server = app.listen(listeningPort, () => {
  logger.info(`----------------------------------`);
  logger.info(`Server Listening on ${listeningPort}`);
  // console.log(`Server Listening on ${listeningPort}`);
});

module.exports = server;
