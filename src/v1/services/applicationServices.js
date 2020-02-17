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
const getServiceDetails = (query, projection, options, callback) => {

    console.log(`Getting single service details with query : ${JSON.stringify(query)}`);
    Models.serviceModel.findOne(query, projection, options, callback)
}

/**
 * 
 * @param {object} query 
 * @param {object} projection 
 * @param {object} options 
 * @param {function(err, data)} callback 
 */
const getAllServicesDetails = (query, projection, options, callback) => {

    console.log(`Getting all service details with query : ${JSON.stringify(query)}`);
    Models.serviceModel.find(query, projection, options, callback);
}

/**
 * 
 * @param {object} query 
 * @param {object} updateDetails 
 * @param {object} options 
 * @param {function(err, data)} callback 
 */
const updateServiceDetails = (query, updateDetails, options, callback) => {

    console.log(`Updating service details with query : ${JSON.stringify(query)}`);
    Models.serviceModel.findOneAndUpdate(query, updateDetails, options, callback);
}

/**
 * 
 * @param {object} newService 
 * @param {function(err, data)} callback 
 */
const createServiceDetails = (newService, callback) => {

    console.log(`Creating new service with query : ${JSON.stringify(newService)}`);
    let newServiceObj = new Models.serviceModel(newService);
    newServiceObj.save(callback);
}

module.exports = {
    getServiceDetails: getServiceDetails,
    getAllServicesDetails: getAllServicesDetails,
    updateServiceDetails: updateServiceDetails,
    createServiceDetails: createServiceDetails
}