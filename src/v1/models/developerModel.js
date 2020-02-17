/**
 * Developer details required for registering
 * app developer details.
 * 
 * @author Ben Philip
 */
'use strict';

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

/**
 * Developer schema definition
 */
const developerSchema = new Schema({
    devName: { type: String, required: true },
    deletable: { type: Boolean, required: true },
    deleted: { type: Boolean, required: true }
});

const developerModel = Mongoose.model('DEVELOPER', developerSchema, 'developers');

module.exports = developerModel;