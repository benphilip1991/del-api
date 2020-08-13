/**
 * Routes for applications
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
const getApplication = {
    method: 'GET',
    path: '/api/v1/application/{applicationId}',
    config: {
        auth: Constants.AUTH_CONFIG.AUTH_STRATEGY,
        description: 'Get single application details',
        tags: ['api', 'application'],
        validate: {
            headers: Joi.object({
                authorization: Joi.string()
            }).options({ allowUnknown: true }),
            params: {
                applicationId: Joi.string().trim().regex(/^[a-zA-Z0-9]+$/)
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

        // Verify if applicationId is a valid ObjectId, else reject
        if (!Mongoose.Types.ObjectId.isValid(request.params.applicationId)) {
            console.log('[INFO]', `${Moment()} --> Invalid applicationId`);
            return Boom.badRequest(Constants.MESSAGES.BAD_PARAMETER);
        }

        // Fetch and return application details
        return new Promise((resolve, reject) => {

            const responseCallback = (error, data) => {
                if (error) {
                    console.log(`${Moment()} Error in fetching application details`);
                    reject(error);
                } else {
                    var statusCode = Constants.HTTP_STATUS.SUCCESS.OK.statusCode;
                    resolve(h.response(data).code(statusCode).header('Content-Type', 'application/json'));
                }
            }
            Controller.ApplicationController.getSingleApplicationDetails(
                request.params.applicationId, responseCallback);
        });
    }
}

/**
 * Get all application details
 */
const getAllApplications = {
    method: 'GET',
    path: '/api/v1/application',
    config: {
        auth: Constants.AUTH_CONFIG.AUTH_STRATEGY,
        description: 'Get all application details',
        tags: ['api', 'application'],
        validate: {
            headers: Joi.object({
                authorization: Joi.string()
            }).options({ allowUnknown: true })
        },
        plugins: {
            'hapi-swagger': {
                security: [{ 'auth_token': {} }]
            }
        }
    },
    handler: (request, h) => {
        console.log('[INFO]', `${Moment()} --> ${request.method.toUpperCase()} ${request.path}`);

        // Fetch and return all application details
        return new Promise((resolve, reject) => {

            const responseCallback = (error, data) => {
                if (error) {
                    console.log(`${Moment()} Error in fetching application details`);
                    reject(error);
                } else {
                    var statusCode = Constants.HTTP_STATUS.SUCCESS.OK.statusCode;
                    resolve(h.response(data).code(statusCode).header('Content-Type', 'application/json'));
                }
            }
            Controller.ApplicationController.getAllApplicationsDetails(responseCallback);
        });
    }
}

/**
 * Delete application details
 */
const deleteApplication = {
    method: 'DELETE',
    path: '/api/v1/application/{applicationId}',
    config: {
        auth: Constants.AUTH_CONFIG.AUTH_STRATEGY,
        description: 'Delete application',
        tags: ['api', 'application'],
        validate: {
            headers: Joi.object({
                authorization: Joi.string()
            }).options({ allowUnknown: true }),
            params: {
                applicationId: Joi.string().trim().regex(/^[a-zA-Z0-9]+$/)
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

        // Verify if applicationId is a valid ObjectId, else reject
        if (!Mongoose.Types.ObjectId.isValid(request.params.applicationId)) {
            console.log('[INFO]', `${Moment()} --> Invalid applicationId`);
            return Boom.badRequest(Constants.MESSAGES.BAD_PARAMETER);
        }

        // Delete application details
        return new Promise((resolve, reject) => {

            const responseCallback = (error, data) => {
                if (error) {
                    console.log(`${Moment()} Error in deleting application`);
                    reject(error);
                } else {
                    var statusCode = Constants.HTTP_STATUS.SUCCESS.OK.statusCode;
                    if (!data._id) {
                        statusCode = Constants.HTTP_STATUS.CLIENT_ERROR.NOT_FOUND.statusCode;
                    }
                    resolve(h.response(data).code(statusCode).header('Content-Type', 'application/json'));
                }
            }
            Controller.ApplicationController.deleteApplicationDetails(
                request.params.applicationId, request.auth.credentials, responseCallback);
        });
    }
}

/**
 * Create new application
 */
const registerNewApplication = {
    method: 'POST',
    path: '/api/v1/application',
    config: {
        auth: Constants.AUTH_CONFIG.AUTH_STRATEGY,
        description: 'Register new application',
        tags: ['api', 'application'],
        validate: {
            headers: Joi.object({
                authorization: Joi.string()
            }).options({ allowUnknown: true }),
            payload: {
                developerId: Joi.string().required().trim().regex(/^[a-zA-Z0-9]+$/),
                applicationName: Joi.string().required().trim().regex(/^[a-zA-Z0-9]+$/),
                applicationDescription: Joi.string().required().trim().regex(/^[a-zA-Z0-9 ]+$/),
                applicationUrl: Joi.string().required().trim(),
                applicationIconUrl: Joi.string().required().trim(),
                dataDescription: Joi.object({
                    dataCollected: Joi.array().items(Joi.object({
                        dataType: Joi.string().required().trim(),
                        description: Joi.string().required().trim()
                    })).allow(null)
                }).allow(null),
                applicationRegistrationDate: Joi.any().forbidden(),
                deleted: Joi.any().forbidden()
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

        if (!Mongoose.Types.ObjectId.isValid(request.payload.developerId)) {
            console.log('[INFO]', `${Moment()} --> Invalid applicationId`);
            return Boom.badRequest(Constants.MESSAGES.BAD_PARAMETER);
        }

        // Register new application
        return new Promise((resolve, reject) => {

            const responseCallback = (error, data) => {
                if (error) {
                    console.log(`${Moment()} Error in creating new application`);
                    reject(error);
                } else {
                    var statusCode = Constants.HTTP_STATUS.SUCCESS.OK.statusCode;
                    if (!data._id) {
                        statusCode = Constants.HTTP_STATUS.CLIENT_ERROR.NOT_FOUND.statusCode;
                    }
                    resolve(h.response(data).code(statusCode).header('Content-Type', 'application/json'));
                }
            }
            Controller.ApplicationController.createNewApplication(
                request.payload, request.auth.credentials, responseCallback);
        });
    }
}

/**
 * Update details for existing application
 */
const updateApplicationDetails = {
    method: 'PUT',
    path: '/api/v1/application/{applicationId}',
    config: {
        auth: Constants.AUTH_CONFIG.AUTH_STRATEGY,
        description: 'Update given application details',
        tags: ['api', 'application'],
        validate: {
            headers: Joi.object({
                authorization: Joi.string()
            }).options({ allowUnknown: true }),
            params: {
                applicationId: Joi.string().trim().regex(/^[a-zA-Z0-9]+$/)
            },
            payload: {
                developerId: Joi.any().forbidden(),
                applicationName: Joi.string().trim().regex(/^[a-zA-Z0-9]+$/),
                applicationDescription: Joi.string().trim().regex(/^[a-zA-Z0-9 ]+$/),
                applicationUrl: Joi.string().trim(),
                applicationIconUrl: Joi.string().trim(),
                dataDescription: Joi.object({
                    dataCollected: Joi.array().items(Joi.object({
                        dataType: Joi.string().trim(),
                        description: Joi.string().trim()
                    })).allow(null)
                }).allow(null),
                applicationRegistrationDate: Joi.any().forbidden(),
                deleted: Joi.any().forbidden()
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

        // Verify if applicationId is a valid ObjectId, else reject
        if (!Mongoose.Types.ObjectId.isValid(request.params.applicationId)) {
            console.log('[INFO]', `${Moment()} --> Invalid applicationId`);
            return Boom.badRequest(Constants.MESSAGES.BAD_PARAMETER);
        }

        // Update application details
        return new Promise((resolve, reject) => {

            const responseCallback = (error, data) => {
                if (error) {
                    console.log(`${Moment()} Error in fetching application details`);
                    reject(error);
                } else {
                    var statusCode = Constants.HTTP_STATUS.SUCCESS.OK.statusCode;
                    if (!data._id) {
                        statusCode = Constants.HTTP_STATUS.CLIENT_ERROR.NOT_FOUND.statusCode;
                    }
                    resolve(h.response(data).code(statusCode).header('Content-Type', 'application/json'));
                }
            }
            Controller.ApplicationController.updateApplicationDetails(
                request.params.applicationId, request.payload, request.auth.credentials, responseCallback);
        });
    }
}

/**
 * Load an application web resource
 */
const loadApplication = {
    method: 'GET',
    path: '/api/v1/application/package/{applicationId}/{applicationUrl}',
    config: {
        description: 'Load an application resource html',
        tags: ['api', 'application'],
        validate: {
            params: {
                applicationId: Joi.string().required().trim().regex(/^[a-zA-Z0-9]+$/),
                applicationUrl: Joi.string().required().trim()
            }
        },
    },
    handler: (request, h) => {
        console.log('[INFO]', `${Moment()} --> ${request.method.toUpperCase()} ${request.path}`);
        return h.file(Constants.APP_STORAGE.PATH + request.params.applicationId + '/' 
            + request.params.applicationUrl + '.html');
    }
}

/**
 * Load an application icon
 */
const loadApplicationIcon = {
    method: 'GET',
    path: '/api/v1/application/package/{applicationId}/{applicationUrl}/icon',
    config: {
        description: 'Load an application resource icon',
        tags: ['api', 'application'],
        validate: {
            params: {
                applicationId: Joi.string().required().trim().regex(/^[a-zA-Z0-9]+$/),
                applicationUrl: Joi.string().required().trim()
            }
        },
    },
    handler: (request, h) => {
        console.log('[INFO]', `${Moment()} --> ${request.method.toUpperCase()} ${request.path}`);
        return h.file(Constants.APP_STORAGE.PATH + request.params.applicationId + '/' 
            + request.params.applicationUrl + '.png');
    }
}

const applicationRoutes = [
    getApplication,
    getAllApplications,
    deleteApplication,
    registerNewApplication,
    updateApplicationDetails,
    loadApplication,
    loadApplicationIcon
]

module.exports = applicationRoutes;