/**
 * Health application services.
 *
 * @author Ben Philip
 */
'use strict';

const Models = require('../models');

/**
 * 
 * @param {object} query 
 * @param {object} projection 
 * @param {object} options 
 * @param {function(err, data)} callback
 */
const getApplicationDetails = (query, projection, options, callback) => {

    console.log(`Getting single application details with query : ${JSON.stringify(query)}`);
    Models.applicationModel.findOne(query, projection, options, callback)
}

/**
 * 
 * @param {object} query 
 * @param {object} projection 
 * @param {object} options 
 * @param {function(err, data)} callback 
 */
const getAllApplicationsDetails = (query, projection, options, callback) => {

    console.log(`Getting all application details with query : ${JSON.stringify(query)}`);
    Models.applicationModel.find(query, projection, options, callback);
}

/**
 * 
 * @param {object} query 
 * @param {object} updateDetails 
 * @param {object} options 
 * @param {function(err, data)} callback 
 */
const updateApplicationDetails = (query, updateDetails, options, callback) => {

    console.log(`Updating application details with query : ${JSON.stringify(query)}`);
    Models.applicationModel.findOneAndUpdate(query, updateDetails, options, callback);
}

/**
 * 
 * @param {object} newApplication 
 * @param {function(err, data)} callback 
 */
const createApplicationDetails = (newApplication, callback) => {

    console.log(`Creating new Application with query : ${JSON.stringify(newApplication)}`);
    let newApplicationObj = new Models.applicationModel(newApplication);
    newApplicationObj.save(callback);
}

module.exports = {
    getApplicationDetails: getApplicationDetails,
    getAllApplicationsDetails: getAllApplicationsDetails,
    updateApplicationDetails: updateApplicationDetails,
    createApplicationDetails: createApplicationDetails
}