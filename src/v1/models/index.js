/**
 * DEL models module
 * 
 * @author Ben Philip
 */

'use strict';

const userModel = require('./userModel');
const userAuthModel = require('./userAuthModel');
const userServicesModel = require('./userServicesModel');
const serviceModel = require('./serviceModel');

const model = {
    userModel: userModel,
    userAuthModel: userAuthModel,
    userServicesModel: userServicesModel,
    serviceModel: serviceModel
}

module.exports = model;