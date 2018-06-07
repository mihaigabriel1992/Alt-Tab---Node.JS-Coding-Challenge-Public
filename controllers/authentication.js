'use strict';

const config = require('../config');
const express = require('express');
// const mw = require('./middleware');
const errors = require('../services/errors.service');
const helperService = require('../services/helper.service');
const userService = require('../services/user.service');
const tokenService = require('../services/tokens.service');

const router = express.Router();

/**
 * @apiVersion 1.0.3
 * @api {post} /login User login
 * @apiName loginUser
 * @apiGroup User
 *
 * @apiParam (Body - Credentials) {string} email User's email address
 * @apiParam (Body - Credentials) {string} password User's password
 *
 * @apiExample {curl} Credentials
 * curl -i -X POST \
     -H "Content-Type:application/json" \
     -d \
     '{
        "email": "your@email.com",
        "password": "password123"
      }' \
      http://localhost:8090/login
 *
 *
 * @apiSuccess (Success Status Codes) 200 Login was successful.
 * @apiSuccessExample {json} Success
  HTTP/1.1 200 OK
  {
      "accessToken": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYmVhcmVyIiwiZXhwa..",
  }
 *
 * @apiUse IllegalArgumentError
 * @apiUse InvalidCredentialsError
 * @apiUse NotFoundError
 */
router.post('/login', (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return next(new errors.IllegalArgumentError());
  }

  userService
      .validateUser(email, password)
      .then((result) => {
        if (!result || !result.id) throw new errors.UnauthorizedError();

        const userToken = tokenService.getAccessToken(
            result.id,
            config.authentication.secret.secretKey);
        res.json(userToken);
      }).catch(next);
});

/**
 * @apiVersion 1.0.0
 * @api {post} /register Register new user
 * @apiName registerUser
 * @apiDescription Register a new user on the platform
 * @apiGroup User
 *
 * @apiParam (Body) {string} email The user email
 * @apiParam (Body) {string} password The user password
 * @apiParam (Body) {string} firstname The user first name
 * @apiParam (Body) {string} lastname The user last name
 *
 * @apiUse IllegalArgumentError
 * @apiUse EmailAlreadyExistsError
 *
 * @apiSuccess (Success Status Codes) 204 Register was successful.
 * @apiExample {curl} Example
 * curl -i -X POST \
    -H "Content-Type:application/json" \
    -d \
    '{
      "email": "your@email.com",
      "password": "yourpassword123",
      "firstname": "John",
      "lastname": "Doe",
    }' \
    http://localhost:8090/register
 *
 * @apiSuccessExample {json} Success
 * HTTP/1.1 204 No Content
 */
router.post('/register', (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const firstName = req.body.firstname || null;
  const lastName = req.body.lastname || null;

  if (!email || !password) {
    return next(new errors.IllegalArgumentError());
  }

  if (!helperService.validateEmail(email)) {
    return next(new errors.IllegalArgumentError('email'));
  }

  if (firstName && !helperService.validateName(firstName, 20)) {
    return next(new errors.IllegalArgumentError('firstName'));
  }

  if (lastName && !helperService.validateName(lastName, 30)) {
    return next(new errors.IllegalArgumentError('lastName'));
  }

  if (!helperService.validatePassword(password)) {
    return next(new errors.IllegalArgumentError('password'));
  }

  userService.register({
    email,
    firstName,
    lastName,
    password,
  }).then((result) => {
    const userToken = tokenService.getAccessToken(
          result.id,
          config.authentication.secret.secretKey);
    res.json(userToken);
  }).catch(next);
});

module.exports = router;
