'use strict';

const config = require('../config');
const express = require('express');
const co = require('co');
const mw = require('./middleware');
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
router.post('/api/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    res.status(400).send({ error: 'Missing email or password' });
  }

  userService
      .validateUser(email, password)
      .then((result) => {
        if (!result || !result.id) return res.status(400).send({ error: 'Unauthorized credentials' });

        const userToken = tokenService.getAccessToken(
            result.id,
            config.authentication.secret.secretKey);
        return res.json(userToken);
      }).catch(error => res.status(400).send({ error }));
});

/**
 * @apiVersion 1.0.0
 * @api {post} /register Register new user
 * @apiName registerUser
 * @apiDescription Register a new user on the api
 * @apiGroup User
 *
 * @apiParam (Body) {string} email The user email
 * @apiParam (Body) {string} password The user password
 * @apiParam (Body) {string} name The user name
 *
 * @apiUse Missing email
 * @apiUse Email Exists
 *
 * @apiSuccess (Success Status Codes) 201 Register was successful.
 * @apiExample {curl} Example
 * curl -i -X POST \
    -H "Content-Type:application/json" \
    -d \
    '{
      "email": "your@email.com",
      "password": "yourpassword123",
      "name": "John",
    }' \
    http://localhost:8090/register
 *
 * @apiSuccess (Success Status Codes) 201 Register was successful.
 * @apiSuccessExample {json} Success
   HTTP/1.1 201 Created
 {
     "accessToken": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYmVhcmVyIiwiZXhwa..",
 }
 */
router.post('/api/register', (req, res) => {
  co(function* register() {
    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name || null;

    if (!email || !password) {
      return res.status(400).send({ error: 'Missing email' });
    }

    if (!helperService.validateEmail(email)) {
      return res.status(400).send({ error: 'Invalid email' });
    }

    if (!helperService.validateName(name, 50)) {
      return res.status(400).send({ error: 'Invalid Name' });
    }

    if (!helperService.validatePassword(password)) {
      return res.status(400).send({ error: 'Invalid Password' });
    }

    const user = yield userService.register({
      email,
      name,
      password,
    });

    const userToken = tokenService.getAccessToken(
        user.id,
        config.authentication.secret.secretKey);
    return res.status(config.http.statusCode.created).json(userToken);
  }).catch(error => res.status(400).send({ error }));
});

/**
 * @apiVersion 1.0.0
 * @api {get} /profile Get profile
 * @apiName getProfile
 * @apiDescription Retrieves the profile information for the authenticated user
 * @apiGroup User
 *
 * @apiUse UnauthorizedError
 *
 * @apiUse AuthenticateMiddleware
 *
 * @apiExample {curl} Example
 * curl -i -X GET
 *    -H "Content-Type:application/json" \
 *    -H "Authorization:Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYmVh..." \
 *    http://localhost:8090/profile
 *
 * @apiSuccess (Success Status Codes) 200 User profile retrieval was successful.
 * @apiSuccessExample {json} Success
 HTTP/1.1 200 OK
 {
  "userId": "eNAHJ4a3uxZp4",
  "name": "test",
  "email": "test@test.com",
}
 */
router.get('/api/profile', mw.authenticate(true), (req, res, next) =>
    userService
        .getProfile(req.userId)
        .then(profile => res.json(profile))
        .catch(next)
);

module.exports = router;
