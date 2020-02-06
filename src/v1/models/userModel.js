/**
 * User schema - contains basic user profile information.
 * Details of linked applications are available in
 * the userServices model.
 * 
 * @author Ben Philip
 */

'use strict'

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

/**
 * User schema definition; 
 * Users can be patients or caregivers
 */
const userSchema = new Schema({
    userId: String,
    emailId: String,
    password: String,
    firstName: String,
    lastName: String,
    age: Number,
    sex: String,
    userRole: String,
    creationDate: Date,
    deleteFlag: Boolean
});

// Compile schema
const userModel = Mongoose.model('USER', userSchema, 'users');

module.exports = userModel;