/**
 * DEL models module
 * 
 * @author Ben Philip
 */

'use strict';

const userModel = require('./userModel');
const userAuthModel = require('./userAuthModel');
const developerModel = require('./developerModel');
const userServicesModel = require('./userServicesModel');
const applicationModel = require('./applicationModel');

const model = {
    userModel: userModel,
    userAuthModel: userAuthModel,
    developerModel: developerModel,
    userServicesModel: userServicesModel,
    applicationModel: applicationModel
}

module.exports = model;