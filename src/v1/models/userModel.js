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
 * TODO: Add deletable flag to make permanent admins
 */
const userSchema = new Schema({
    emailId: { type: String, required: true, index: { unique: true } },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    age: { type: Number, required: true },
    sex: { type: String, required: true },
    userRole: { type: String, required: true },
    creationDate: { type: Date, required: true },
    deleted: { type: Boolean, required: true },
    deletable: { type: Boolean, required: true },
    developerId: {type: String, required: false}
});

// Compile schema
const userModel = Mongoose.model('USER', userSchema, 'users');

module.exports = userModel;