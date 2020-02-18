/**
 * User services record for tracking services added
 * by the user or assigned by a caregiver
 * 
 * @author Ben Philip
 */

'use strict';

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

/**
 * Service schema for connecting users to their
 * linked services
 */
const userApplicationSchema = new Schema({
    userId: { type: String, required: true },
    applications: [{
        applicationId: { type: String, required: true },
        addedBy: { type: String, required: true },
        addedOn: { type: Date, required: true }
    }]
});

// Compile schema
const userApplicationModel = Mongoose.model('USERAPPLICATIONS', userApplicationSchema, 'userapplications');

module.exports = userApplicationModel;