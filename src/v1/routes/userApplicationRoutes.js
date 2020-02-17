/**
 * Routes for the user application resource
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
 * User application routes and definitions
 */
/**
 * Get all registered applications for a given user
 */
const getAllUserApplications = {
    method: 'GET',
    path: '/api/v1/user/{userId}/userApplication',
    config: {
        auth: Constants.AUTH_CONFIG.AUTH_STRATEGY,
        description: 'Get all applications registered to a user',
        tags: ['api', 'user_applications'],
        validate: {
            headers: Joi.object({
                authorization: Joi.string()
            }).options({ allowUnknown: true }),
            params: {
                userId: Joi.string().trim().regex(/^[a-zA-Z0-9]+$/)
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

        // Verify if userId is a valid ObjectId, else reject
        if (!Mongoose.Types.ObjectId.isValid(request.params.userId)) {
            console.log('[INFO]', `${Moment()} --> Invalid userId`);
            return Boom.badRequest(Constants.MESSAGES.BAD_PARAMETER);
        }

        // Fetch and return user application details
        return new Promise((resolve, reject) => {
            const responseCallback = (error, data) => {
                if (error) {
                    console.log(`${Moment()} Error in fetching user application details`);
                    reject(error);
                } else {
                    var statusCode = Constants.HTTP_STATUS.SUCCESS.OK.statusCode;
                    resolve(h.response(data).code(statusCode).header('Content-Type', 'application/json'));
                }
            }
            Controller.UserApplicationController.getAllUserApplications(
                request.params.userId, request.auth.credentials, responseCallback);
        });
    }
}

/**
 * Update the list of user applications
 * Operations include linknig or removing applications
 */
const updateUserApplication = {
    method: 'PUT',
    path: '/api/v1/user/{userId}/userApplication',
    config: {
        auth: Constants.AUTH_CONFIG.AUTH_STRATEGY,
        description: 'Update applications registered to a user',
        tags: ['api', 'user_applications'],
        validate: {
            headers: Joi.object({
                authorization: Joi.string()
            }).options({ allowUnknown: true }),
            params: {
                userId: Joi.string().trim().regex(/^[a-zA-Z0-9]+$/)
            },
            payload: {
                applications: Joi.array().items(Joi.object({
                    applicationId: Joi.string().trim().required().regex(/^[a-zA-Z0-9]+$/),
                    addedBy: Joi.string().trim().required().regex(/^[a-zA-Z0-9]+$/),
                    addedOn: Joi.any().forbidden()
                }))
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

        // Verify if userId is a valid ObjectId, else reject
        if (!Mongoose.Types.ObjectId.isValid(request.params.userId)) {
            console.log('[INFO]', `${Moment()} --> Invalid userId`);
            return Boom.badRequest(Constants.MESSAGES.BAD_PARAMETER);
        }

        // Update user application details
        return new Promise((resolve, reject) => {
            const responseCallback = (error, data) => {
                if (error) {
                    console.log(`${Moment()} Error in updating user applications`);
                    reject(error);
                } else {
                    var statusCode = Constants.HTTP_STATUS.SUCCESS.OK.statusCode;
                    resolve(h.response(data).code(statusCode).header('Content-Type', 'application/json'));
                }
            }
            Controller.UserApplicationController.updateUserApplication(
                request.params.userId, request.payload, request.auth.credentials, responseCallback);
        });
    }
}

const UserApplicationRoutes = [
    getAllUserApplications,
    updateUserApplication
];

module.exports = UserApplicationRoutes;