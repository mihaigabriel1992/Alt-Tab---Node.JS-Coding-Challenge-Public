'use strict';

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const config = require('./config');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

mongoose.connect(config.db.host, (error) => {
  if (error) console.log(`Error connecting to db - ${config.db.host} with message ${error.description}`);

  console.log(`Connected to db - ${config.db.host}...`);
});

const app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(require('./controllers/authentication'));

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

/**
 * Listen on provided port, on all network interfaces.
 */

app.listen(config.port, () => {
  console.log(`Listening on port ${config.port}...`);
});

module.exports = app;
