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
const userServicesSchema = new Schema({
    userId: String,
    services: [{
        serviceId: String,
        assignedBy: String
    }]
});

// Compile schema
const userServicesModel = Mongoose.model('SERVICE', userServicesSchema, 'services');

module.exports = userServicesModel;