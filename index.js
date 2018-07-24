'use strict';
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const passport = require('passport');
const localStrategy = require('./auth/passport/local');
const jwtStrategy = require('./auth/passport/jwt');
const fbStrategy = require('./auth/passport/facebook');

const { PORT, CLIENT_ORIGIN } = require('./config');

const { dbConnect } = require('./db-mongoose');

passport.use(localStrategy);
passport.use(jwtStrategy);
passport.use(fbStrategy);

const app = express();

app.use(passport.initialize());

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

app.get('/', (req, res, err) => {
  console.log('/');
  res.json(null);
});

app.get('/login', (req, res, err) => {
  console.log('/login');
  res.json(null);
});

app.get('/auth/facebook', passport.authenticate('facebook'));

app.get('/auth/facebook/return', passport.authenticate('facebook',
  { successRedirect: '/',
    failureRedirect: '/login' })
);

dbConnect();

const server = app.listen(PORT, () => {
  console.info(`App listening on port ${server.address().port}`);
}).on('error', err => {
  console.error('Express failed to start');
  console.error(err);
});