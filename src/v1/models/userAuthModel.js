/**
 * UserAuth schema - contains user authentication 
 * token details.
 * 
 * @author Ben Philip
 */

'use strict'

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

/**
 * User auth schema definition
 */
const userAuthSchema = new Schema({
    userId: { type: String, required: true, index: { unique: true } },
    token: { type: String, required: true }
});

// Compile schema
const userAuthModel = Mongoose.model('USERAUTH', userAuthSchema, 'userauth');

module.exports = userAuthModel;