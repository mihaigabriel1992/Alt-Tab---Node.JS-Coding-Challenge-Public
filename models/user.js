/**
 * @module models/user
 */

/**
 * @param {Schema} mongoose The mongoose object
 * @param {Object} DataTypes Mongoose data types
 * @returns {Model} User mongoose model
 */
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: String,
  name: String,
  password: String,
});

const user = mongoose.model('User', userSchema);

module.exports = {
  user,
};
