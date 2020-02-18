/**
 * Developer model operations
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
const getSingleDeveloper = (query, projection, options, callback) => {

    console.log(`Getting single developer with query : ${JSON.stringify(query)}`);
    Models.developerModel.findOne(query, projection, options, callback);
}

/**
 * Get all registered users
 * @param {object} query 
 * @param {object} projection 
 * @param {object} options 
 * @param {function(err, data)} callback 
 */
const getAllDevelopers = (query, projection, options, callback) => {

    console.log(`Getting all developers with query : ${JSON.stringify(query)}`);
    Models.developerModel.find(query, projection, options, callback);
}

/**
 * Update given user
 * @param {object} query 
 * @param {object} projection 
 * @param {object} options 
 * @param {function(err, data)} callback 
 */
const updateSingleDeveloper = (query, updateData, options, callback) => {

    console.log(`Updating developer with query : ${JSON.stringify(query)}`);
    Models.developerModel.findOneAndUpdate(query, updateData, options, callback);
}

/**
 * Create new user record
 * @param {object} newUser 
 * @param {function(err, data)} callback 
 */
const createNewDeveloper = (newDeveloper, callback) => {

    let userObj = new Models.developerModel(newDeveloper);
    userObj.save(callback);
}

const developerServices = {
    getSingleDeveloper: getSingleDeveloper,
    getAllDevelopers: getAllDevelopers,
    updateSingleDeveloper: updateSingleDeveloper,
    createNewDeveloper: createNewDeveloper
}

module.exports = developerServices;