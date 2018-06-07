/**
 * NodeJs Error
 * @external Error
 * @see https://nodejs.org/api/errors.html
 */

/**
 * Illegal argument error. Throws error, together with its stack.
 * and optionally outputs the argument.
 * that caused the error, together with a custom message.
 * @param {string} [argName] - actual name of the illegal argument
 * @param {string} [userMessage] - User readable message outputted on error throw.
 * @param {int} [code] - Error code mapped in applications
 * @class
 * @memberof! errors
 * @extends external:Error
 */
function IllegalArgumentError(argName, userMessage, code) {
  if (typeof argName === 'undefined' || argName === '') {
    argName = 'NOT_SUPPLIED';
  }
  if (typeof userMessage === 'undefined') {
    userMessage = '';
  }
  if (typeof code === 'undefined') {
    code = 400;
  }
  Error.call(this);

  this.group = 'IllegalArgumentError';
  this.name = this.constructor.name;
    /**
     * @type {string}
     */
  if (argName !== 'NOT_SUPPLIED') {
    this.message = `Argument name: ${argName}. ${userMessage}`;
  } else {
    this.message = userMessage;
  }
  this.code = code;

  Error.captureStackTrace(this, IllegalArgumentError);
}

/**
 * Unauthorized error. Throws error, together with its stack.
 * and optionally outputs a custom message.
 * @param {string} [userMessage] - User readable message outputted on error throw.
 * @class
 * @memberof! errors
 * @extends external:Error
 */
function UnauthorizedError(userMessage) {
  if (typeof userMessage === 'undefined') {
    userMessage = '';
  }
  Error.call(this);

  this.group = 'UnauthorizedError';
  this.name = this.constructor.name;
    /**
     * @type {string}
     */
  this.message = userMessage;

  Error.captureStackTrace(this, UnauthorizedError);
}

module.exports = {
  IllegalArgumentError,
  UnauthorizedError,
};
