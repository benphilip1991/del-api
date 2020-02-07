/**
 * User model operations
 * 
 * @author Ben Philip
 */

'use strict';

const Models = require('../models');

/**
 * Get single user
 * @param {*} query 
 * @param {*} projection 
 * @param {*} options 
 * @param {*} callback 
 */
const getSingleUser = (query, projection, options, callback) => {

    console.log(`Getting single user with query : ${JSON.stringify(query)}`);
    Models.userModel.findOne(query, projection, options, callback);
}

/**
 * Get all registered users
 * @param {*} query 
 * @param {*} projection 
 * @param {*} options 
 * @param {*} callback 
 */
const getAllUsers = (query, projection, options, callback) => {

}

/**
 * Update given user
 * @param {*} query 
 * @param {*} projection 
 * @param {*} options 
 * @param {*} callback 
 */
const updateSingleUser = (query, projection, options, callback) => {

}

/**
 * Create new user record
 * @param {*} newUser 
 * @param {*} callback 
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