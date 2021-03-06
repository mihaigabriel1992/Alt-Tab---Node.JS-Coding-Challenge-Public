/* eslint no-console: "off", global-require: "off" */
const _ = require('lodash');

const config = {
  db: {
    host: process.env.DB_HOST,
  },

  authentication: {
    accessTokenExpireTime: process.env.NODE_ACCESS_TOKEN_EXPIRE_TIME || '+30d',
    // Generate token secret key
    secret: {
      secretKey: process.env.NODE_ACCESS_SECTRET,
    },
  },
  http: {
    statusCode: {
      created: 201,
    },
  },

  port: 8090,
};

if (process.env.NODE_ENV && process.env.NODE_ENV !== 'default') {
  _.merge(config, require(`./${process.env.NODE_ENV}`));
}

module.exports = config;
