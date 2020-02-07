/**
 * DEL models module
 * 
 * @author Ben Philip
 */

'use strict';

const userModel = require('./userModel');
const userServicesModel = require('./userServicesModel');
const serviceModel = require('./serviceModel');

const model = {
    userModel: userModel,
    userServicesModel: userServicesModel,
    serviceModel: serviceModel
}

module.exports = model;