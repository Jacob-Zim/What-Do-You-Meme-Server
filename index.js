'use strict';
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const passport = require('passport');
const localStrategy = require('./auth/passport/local');
const jwtStrategy = require('./auth/passport/jwt');

const { PORT, CLIENT_ORIGIN } = require('./config');

const { dbConnect } = require('./db-mongoose');

passport.use(localStrategy);
passport.use(jwtStrategy);

const app = express();

app.use(
  morgan(process.env.NODE_ENV === 'production' ? 'common' : 'dev', {
    skip: (req, res) => process.env.NODE_ENV === 'test'
  })
);

app.use(
  cors({
    origin: CLIENT_ORIGIN
  })
);

app.use(bodyParser.json());

dbConnect();

const server = app.listen(PORT, () => {
  console.info(`App listening on port ${server.address().port}`);
}).on('error', err => {
  console.error('Express failed to start');
  console.error(err);
});