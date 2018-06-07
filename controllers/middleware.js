'use strict';

/* eslint no-param-reassign: "off" */
/* eslint no-shadow: "off" */
/* eslint no-unused-vars: "off" */

const _ = require('lodash');
const tokenService = require('../services/tokens.service');

/**
 * @apiDefine user Logged in user clients
 */

/**
 * @apiDefine everybody Any client
 */

/**
 * @apiDefine AuthenticateMiddleware Authenticates a request based on the authorization header.
 *
 *
 * @apiHeader {string} authorization The authorization token. This parameter can also be specified
 * as the accessToken query parameter.
 * @apiError UnauthorizedError Throws unauthorized error if the client wasn't able to authenticate
 */
function authenticate(mandatory) {
  return (req, res, next) => {
    const accessToken = req.headers.authorization || (req.query && req.query.accessToken);

    if (accessToken) {
      return tokenService
        .validateAccessToken(accessToken)
        .then((userId) => {
          req.userId = userId;
          return userId;
        })
        .then(() => {
          next();
        })
        .catch(next);
    }

    if (mandatory) {
      return res.sendStatus(401);
    }

    // by default, show only content safe for all ages
    req.contentRating = 0;
    return next();
  };
}

module.exports = {
  authenticate,
};
