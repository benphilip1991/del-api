/**
 * Routes for applications services
 * 
 * @author Ben Philip
 */
'use strict';

const Joi = require('@hapi/joi');
const Boom = require('@hapi/boom');
const Moment = require('moment');
const Mongoose = require('mongoose');
const Controller = require('../controller');
const Constants = require('../config/constants');

/**
 * Route definutions and validation
 */
/**
 * Get specific application details
 */
const getApplicationService = {
    method: 'GET',
    path: '/api/v1/service/{serviceId}',
    config: {
        auth: Constants.AUTH_CONFIG.AUTH_STRATEGY,
        description: 'Get single service details',
        tags: ['api', 'service'],
        validate: {
            params: {
                serviceId: Joi.string().trim().regex(/^[a-zA-Z0-9]+$/)
            }
        },
        plugins: {
            'hapi-swagger': {
                security: [{ 'auth_token': {} }]
            }
        }
    },
    handler: (request, h) => {
        console.log('[INFO]', `${Moment()} --> ${request.method.toUpperCase()} ${request.path}`);

        // Verify if serviceId is a valid ObjectId, else reject
        if (!Mongoose.Types.ObjectId.isValid(request.params.serviceId)) {
            console.log('[INFO]', `${Moment()} --> Invalid serviceId`);
            return Boom.badRequest(Constants.MESSAGES.BAD_PARAMETER);
        }

        // Fetch and return service details
        return new Promise((resolve, reject) => {

            const responseCallback = (error, data) => {
                if(error) {
                    console.log(`${Moment()} Error in fetching service details`);
                    reject(error);
                } else {
                    var statusCode = Constants.HTTP_STATUS.SUCCESS.OK.statusCode;
                    if (!data._id) {
                        statusCode = Constants.HTTP_STATUS.CLIENT_ERROR.NOT_FOUND.statusCode;
                    }
                    resolve(h.response(data).code(statusCode).header('Content-Type', 'application/json'));
                }
            }
            Controller.ApplicationServiceController.getSingleApplicationDetails(
                request.params.serviceId, responseCallback);
        });
    }
}

/**
 * Get all application details
 */
const getAllApplicationServices = {
    method: 'GET',
    path: '/api/v1/service',
    config: {
        auth: Constants.AUTH_CONFIG.AUTH_STRATEGY,
        description: 'Get all service details',
        tags: ['api', 'service'],
        plugins: {
            'hapi-swagger': {
                security: [{ 'auth_token': {} }]
            }
        }
    },
    handler: (request, h) => {
        console.log('[INFO]', `${Moment()} --> ${request.method.toUpperCase()} ${request.path}`);

        // Fetch and return service details
        return new Promise((resolve, reject) => {

            const responseCallback = (error, data) => {
                if(error) {
                    console.log(`${Moment()} Error in fetching service details`);
                    reject(error);
                } else {
                    var statusCode = Constants.HTTP_STATUS.SUCCESS.OK.statusCode;
                    if (!data._id) {
                        statusCode = Constants.HTTP_STATUS.CLIENT_ERROR.NOT_FOUND.statusCode;
                    }
                    resolve(h.response(data).code(statusCode).header('Content-Type', 'application/json'));
                }
            }
            Controller.ApplicationServiceController.getAllApplicationsDetails(responseCallback);
        });
    }
}

/**
 * Delete application service details
 */
const deleteApplicationService = {
    method: 'DELETE',
    path: '/api/v1/service/{serviceId}',
    config: {
        auth: Constants.AUTH_CONFIG.AUTH_STRATEGY,
        description: 'Delete service',
        tags: ['api', 'service'],
        validate: {
            params: {
                serviceId: Joi.string().trim().regex(/^[a-zA-Z0-9]+$/)
            }
        },
        plugins: {
            'hapi-swagger': {
                security: [{ 'auth_token': {} }]
            }
        }
    },
    handler: (request, h) => {
        console.log('[INFO]', `${Moment()} --> ${request.method.toUpperCase()} ${request.path}`);

        // Verify if serviceId is a valid ObjectId, else reject
        if (!Mongoose.Types.ObjectId.isValid(request.params.serviceId)) {
            console.log('[INFO]', `${Moment()} --> Invalid serviceId`);
            return Boom.badRequest(Constants.MESSAGES.BAD_PARAMETER);
        }

        // Fetch and return service details
        return new Promise((resolve, reject) => {

            const responseCallback = (error, data) => {
                if(error) {
                    console.log(`${Moment()} Error in deleting service`);
                    reject(error);
                } else {
                    var statusCode = Constants.HTTP_STATUS.SUCCESS.OK.statusCode;
                    if (!data._id) {
                        statusCode = Constants.HTTP_STATUS.CLIENT_ERROR.NOT_FOUND.statusCode;
                    }
                    resolve(h.response(data).code(statusCode).header('Content-Type', 'application/json'));
                }
            }
            Controller.ApplicationServiceController.deleteServiceDetails(
                request.params.serviceId, request.auth.credentials, responseCallback);
        });
    }
}

/**
 * Create new application service
 */
const registerNewApplicationService = {
    method: 'POST',
    path: '/api/v1/service',
    config: {
        auth: Constants.AUTH_CONFIG.AUTH_STRATEGY,
        description: 'Register new service',
        tags: ['api', 'service'],
        validate: {
            payload: {

            }
        },
        plugins: {
            'hapi-swagger': {
                security: [{ 'auth_token': {} }]
            }
        }
    },
    handler: (request, h) => {
        console.log('[INFO]', `${Moment()} --> ${request.method.toUpperCase()} ${request.path}`);

        // Fetch and return service details
        return new Promise((resolve, reject) => {

            const responseCallback = (error, data) => {
                if(error) {
                    console.log(`${Moment()} Error in creating new service`);
                    reject(error);
                } else {
                    var statusCode = Constants.HTTP_STATUS.SUCCESS.OK.statusCode;
                    if (!data._id) {
                        statusCode = Constants.HTTP_STATUS.CLIENT_ERROR.NOT_FOUND.statusCode;
                    }
                    resolve(h.response(data).code(statusCode).header('Content-Type', 'application/json'));
                }
            }
            Controller.ApplicationServiceController.createNewApplicationService(
                request.payload, request.auth.credentials, responseCallback);
        });
    }
}

/**
 * Update details for existing application
 */
const updateApplicationDetails = {
    method: 'PUT',
    path: '/api/v1/service/{serviceId}',
    config: {
        auth: Constants.AUTH_CONFIG.AUTH_STRATEGY,
        description: 'Update given service details',
        tags: ['api', 'service'],
        validate: {
            params: {
                serviceId: Joi.string().trim().regex(/^[a-zA-Z0-9]+$/)
            },
            payload: {

            }
        },
        plugins: {
            'hapi-swagger': {
                security: [{ 'auth_token': {} }]
            }
        }
    },
    handler: (request, h) => {
        console.log('[INFO]', `${Moment()} --> ${request.method.toUpperCase()} ${request.path}`);

        // Verify if serviceId is a valid ObjectId, else reject
        if (!Mongoose.Types.ObjectId.isValid(request.params.serviceId)) {
            console.log('[INFO]', `${Moment()} --> Invalid serviceId`);
            return Boom.badRequest(Constants.MESSAGES.BAD_PARAMETER);
        }

        // Fetch and return service details
        return new Promise((resolve, reject) => {

            const responseCallback = (error, data) => {
                if(error) {
                    console.log(`${Moment()} Error in fetching service details`);
                    reject(error);
                } else {
                    var statusCode = Constants.HTTP_STATUS.SUCCESS.OK.statusCode;
                    if (!data._id) {
                        statusCode = Constants.HTTP_STATUS.CLIENT_ERROR.NOT_FOUND.statusCode;
                    }
                    resolve(h.response(data).code(statusCode).header('Content-Type', 'application/json'));
                }
            }
            Controller.ApplicationServiceController.updateServiceDetails(
                request.params.serviceId, request.payload, request.auth.credentials, responseCallback);
        });
    }
}

const applicationServiceRoutes = [
    getApplicationService,
    getAllApplicationServices,
    deleteApplicationService,
    registerNewApplicationService,
    updateApplicationDetails
]

module.exports = applicationServiceRoutes;