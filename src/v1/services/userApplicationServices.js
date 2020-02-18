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

/**
 * Permanently delete user-application mapping.
 * Highly unlikely this function will be used
 * @param {object} query 
 * @param {object} options 
 * @param {function(err, data)} callback 
 */
const deleteUserApplicationList = (query, options, callback) => {
    console.log(`Permenantly deleting user application list with query : ${JSON.stringify(query)}`);
    Models.userApplicationsModel.findOneAndDelete(query, options, callback);
}

/**
 * Create a new map for user applications. Never called through APIs
 * and is triggered from the user service only when a new user is created.
 * 
 * @param {object} newUserDetails 
 * @param {function(err, data)} callback 
 */
const createNewUserApplicationList = (userId, callback) => {
    
    let newUserDetails = {
        userId: userId,
        applications: []
    };
    let userApplicationMap = new Models.userApplicationsModel(newUserDetails);
    userApplicationMap.save(callback);
}

const userApplicationServices = {
    getAllUserApplications: getAllUserApplications,
    updateUserApplicationList: updateUserApplicationList,
    deleteUserApplicationList: deleteUserApplicationList,
    createNewUserApplicationList: createNewUserApplicationList
}

module.exports = userApplicationServices;