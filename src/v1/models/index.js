/**
 * DEL models module
 * 
 * @author Ben Philip
 */

'use strict';

const userModel = require('./userModel');
const userAuthModel = require('./userAuthModel');
const developerModel = require('./developerModel');
const userApplicationsModel = require('./userApplicationsModel');
const applicationModel = require('./applicationModel');

const model = {
    userModel: userModel,
    userAuthModel: userAuthModel,
    developerModel: developerModel,
    userApplicationsModel: userApplicationsModel,
    applicationModel: applicationModel
}

module.exports = model;