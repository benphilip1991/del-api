/**
 * User Application Service model operations
 * The service provides function to manipulate the
 * list of services added to a user's profile.
 * 
 * @author Ben Philip
 */

'use strict';

const Models = require('../models');

/**
 * Get all linked services for a user
 * @param {object} query 
 * @param {object} projection 
 * @param {object} options 
 * @param {function(err, data)} callback 
 */
const getAllUserApplications = (query, projection, options, callback) => {

    console.log(`Getting all user applications with query : ${JSON.stringify(query)}`);
    Models.userApplicationsModel.findOne(query, projection, options, callback);
}

/**
 * Add services to user application list 
 * @param {object} query 
 * @param {object} projection 
 * @param {object} options 
 * @param {function(err, data)} callback 
 */
const updateUserApplicationList = (query, updateData, options, callback) => {

    console.log(`Updating user applications list with query : ${JSON.stringify(query)}`);
    Models.userApplicationsModel.findOneAndUpdate(query, updateData, options, callback);
}


const userApplicationServices = {
    getAllUserApplications: getAllUserApplications,
    updateUserApplicationList: updateUserApplicationList
}

module.exports = userApplicationServices;