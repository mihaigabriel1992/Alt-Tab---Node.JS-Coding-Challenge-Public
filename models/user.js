/**
 * @module models/user
 */

/**
 * @param {Schema} sequelize The sequelize object
 * @param {Object} DataTypes Sequelize data types
 * @returns {Model} Users Sequelize model
 */
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: String,
  first_name: String,
  last_name: String,
  password: String,
});

const user = mongoose.model('User', userSchema);

module.exports = {
  user,
};
