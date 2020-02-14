/**
 * Application services controller for managing
 * applications that will be linked to user profiles
 * and run on the mobile container.
 * 
 * @author Ben Philip
 */
'use strict';

const async = require('async');
const Boom = require('@hapi/boom');
const Moment = require('moment');
const Services = require('../services');
const Contants = require('../config');

/**
 * Get details for a given application.
 * Only registered platform users are permitted to fetch
 * app details. Unregistered users are filtered off at the
 * route filter.
 * 
 * @param {string} serviceId  
 * @param {function(err, data)} callback 
 */
const getSingleApplicationDetails = (serviceId, callback) => {

}

/**
 * Get details for all registered applications
 * Only registered platform users are permitted to fetch
 * app details. Unregistered users are filtered off at the
 * route filter.
 * 
 * @param {function(err, data)} callback 
 */
const getAllApplicationsDetails = (callback) => {

}

/**
 * Delete (soft-delete) a registered service.
 * Only admins and developers are allowed to delete a service.
 * All other users are rejected
 * 
 * @param {string} serviceId 
 * @param {object} credentials 
 * @param {function(err, data)} callback 
 */
const deleteServiceDetails = (serviceId, credentials, callback) => {

}

/**
 * Update details of a registered service.
 * Only admins and developers are allowed to update a service.
 * All other users are rejected
 * 
 * @param {string} serviceId 
 * @param {object} payload 
 * @param {object} credentials 
 * @param {function(err, data)} callback 
 */
const updateServiceDetails = (serviceId, payload, credentials, callback) => {

}

/**
 * Create a new application service.
 * Update details of a registered service.
 * Only admins and developers are allowed to create a service.
 * All other users are rejected
 * 
 * TODO: add admin approval for services. Developers can request registration
 * 
 * @param {object} payload 
 * @param {object} credentials 
 * @param {function(err, data)} callback 
 */
const createNewApplicationService = (payload, credentials, callback) => {

}

module.exports = {
    getSingleApplicationDetails: getSingleApplicationDetails,
    getAllApplicationsDetails: getAllApplicationsDetails,
    deleteServiceDetails: deleteServiceDetails,
    updateServiceDetails: updateServiceDetails,
    createNewApplicationService: createNewApplicationService
}