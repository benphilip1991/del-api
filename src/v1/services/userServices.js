/**
 * User model operations
 * 
 * @author Ben Philip
 */

'use strict';

const Models = require('../models');

/**
 * Get single user
 * @param {object} query 
 * @param {object} projection 
 * @param {object} options 
 * @param {function(err, data)} callback 
 */
const getSingleUser = (query, projection, options, callback) => {

    console.log(`Getting single user with query : ${JSON.stringify(query)}`);
    Models.userModel.findOne(query, projection, options, callback);
}

/**
 * Get all registered users
 * @param {object} query 
 * @param {object} projection 
 * @param {object} options 
 * @param {function(err, data)} callback 
 */
const getAllUsers = (query, projection, options, callback) => {

    console.log(`Getting all users with query : ${JSON.stringify(query)}`);
    Models.userModel.find(query, projection, options, callback);
}

/**
 * Update given user
 * @param {object} query 
 * @param {object} projection 
 * @param {object} options 
 * @param {function(err, data)} callback 
 */
const updateSingleUser = (query, updateData, options, callback) => {

    console.log(`Updating user with query : ${JSON.stringify(query)}`);
    Models.userModel.findOneAndUpdate(query, updateData, options, callback);
}

/**
 * Create new user record
 * @param {object} newUser 
 * @param {function(err, data)} callback 
 */
const createNewUser = (newUser, callback) => {

    let userObj = new Models.userModel(newUser);
    userObj.save(callback);
}

const userServices = {
    getSingleUser: getSingleUser,
    getAllUsers: getAllUsers,
    updateSingleUser: updateSingleUser,
    createNewUser: createNewUser
}

module.exports = userServices;