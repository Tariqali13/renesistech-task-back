const express = require('express');
const mongoose = require('mongoose');
const config = require('config');
const cors = require('cors');
const app = express();
const Api = require('./api');
const appRoot = require('app-root-path');
const rootLogger = require(appRoot + '/src/logger').rootLogger;
const timeLogger = require(appRoot + '/src/logger').timeLogger;
const responseTime = require('response-time');
const http = require('http');
const commonUtility = require(appRoot + '/src/util/common-util');
const calculateApiTimeUtil = commonUtility.calculateApiTime();
const MONGODB_URL = config.get('datasource.databaseUrl');
const port = process.env.PORT || 8080;

const corsOpt = {
  origin: "*",
  credentials: true,
  exposedHeaders: 'authorization',
  maxAge: 10 * 60,
}

app.use(cors(corsOpt));
app.use(express.json());

mongoose
  .connect(MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log('Database Connected to renesistech-task App');
    rootLogger.info('Database Connected to renesistech-task App');
  })
  .catch((err) => console.log('connection error occurred:', err));
//
app.use(responseTime(async (req, res, time) => {
  const timeTaken = await calculateApiTimeUtil.calculateApiTime(time);
  timeLogger.info(`${req.originalUrl}: ${timeTaken}`);
}));


app.use('/api', Api);

http.createServer(app).listen(port, function () {
  console.log('Http server listening on port ' + port);
  rootLogger.info('Http server listening on port ' + port);
});
