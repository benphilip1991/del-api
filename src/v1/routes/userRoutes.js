/**
 * Routes for the user resource
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
 * Route definitions and Joi validation for users.
 */

/**
 * Get specific user
 */
const getUser = {
    method: 'GET',
    path: '/api/v1/user/{userId}',
    config: {
        auth: Constants.AUTH_CONFIG.AUTH_STRATEGY,
        description: 'Get single user details',
        tags: ['api', 'user'],
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

        // Verify if userId is an objectId, else reject
        if (!Mongoose.Types.ObjectId.isValid(request.params.userId)) {
            console.log('[INFO]', `${Moment()} --> Invalid userId`)
            return Boom.badRequest(Constants.MESSAGES.BAD_PARAMETER);
        }

        // Return user details
        return new Promise((resolve, reject) => {

            // Response callback
            const responseCallback = (error, data) => {
                if (error) {
                    console.log(`${Moment()} Error in Getting specific user`);
                    reject(error);
                } else {
                    var statusCode = Constants.HTTP_STATUS.SUCCESS.OK.statusCode;
                    if (!data._id) {
                        statusCode = Constants.HTTP_STATUS.CLIENT_ERROR.NOT_FOUND.statusCode;
                    }
                    resolve(h.response(data).code(statusCode).header('Content-Type', 'application/json'));
                }
            }
            Controller.UserController.getSingleUser(request.params.userId, request.auth.credentials, responseCallback);
        });
    }
}

/**
 * Get all users - this API is only available to
 * admins and caregivers
 */
const getAllUsers = {
    method: 'GET',
    path: '/api/v1/user',
    config: {
        auth: Constants.AUTH_CONFIG.AUTH_STRATEGY,
        description: 'Get all user records',
        tags: ['api', 'user'],
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

        return new Promise((resolve, reject) => {

            // Response callback
            const responseCallback = (error, data) => {
                if (error) {
                    console.log(`${Moment()} Error getting users`);
                    reject(error);
                } else {
                    var statusCode = Constants.HTTP_STATUS.SUCCESS.OK.statusCode;

                    // Empty user list
                    if (!data.users) {
                        statusCode = Constants.HTTP_STATUS.CLIENT_ERROR.NOT_FOUND.statusCode;
                    }
                    resolve(h.response(data).code(statusCode).header('Content-Type', 'application/json'));
                }
            }
            Controller.UserController.getAllUsers(request.auth.credentials, responseCallback);
        });
    }
}

/**
 * Register user - this API is only available to
 * admins and caregivers
 */
const registerUser = {
    method: 'POST',
    path: '/api/v1/user',
    config: {
        auth: Constants.AUTH_CONFIG.AUTH_STRATEGY,
        description: "Register new user",
        tags: ['api', 'user'],
        validate: {
            headers: Joi.object({
                authorization: Joi.string()
            }).options({ allowUnknown: true }),
            payload: {
                firstName: Joi.string().required().trim().regex(/^[a-zA-Z ]+$/),
                lastName: Joi.string().required().trim().regex(/^[a-zA-Z ]+$/),
                emailId: Joi.string().email().required().trim(),
                age: Joi.number().required(),
                sex: Joi.string().required().regex(/^[a-zA-Z ]+$/).max(6),
                password: Joi.string().required().trim().min(6),
                userRole: Joi.string().equal(
                    Constants.USER_ROLES.ADMIN,
                    Constants.USER_ROLES.CAREGIVER,
                    Constants.USER_ROLES.PATIENT,
                    Constants.USER_ROLES.DEVELOPER
                ),
                creationDate: Joi.any().forbidden(),
                deleted: Joi.any().forbidden(),
                deletable: Joi.any().forbidden()
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

        return new Promise((resolve, reject) => {
            const responseCallback = (error, data) => {
                if (error) {
                    reject(error);
                } else {
                    // Created successfully
                    var statusCode = Constants.HTTP_STATUS.SUCCESS.CREATED.statusCode
                    resolve(
                        h.response(data).
                            code(statusCode).header('Content-Type', 'application/json')
                    );
                }
            }

            Controller.UserController.registerUser(request.payload, request.auth.credentials, responseCallback);
        });
    }
}

/**
 * Delete user API - this API only soft-deletes a user
 * and doesn't remove user records.
 */
const deleteSingleUser = {
    method: 'DELETE',
    path: '/api/v1/user/{userId}',
    config: {
        auth: Constants.AUTH_CONFIG.AUTH_STRATEGY,
        description: 'Delete existing user',
        tags: ['api', 'user'],
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

        // Verify if userId is an objectId, else reject
        if (!Mongoose.Types.ObjectId.isValid(request.params.userId)) {
            console.log('[INFO]', `${Moment()} --> Invalid UserId`)
            return Boom.badRequest(Constants.MESSAGES.BAD_PARAMETER);
        }

        // Delete user and return status
        return new Promise((resolve, reject) => {

            // Response callback
            const responseCallback = (error, data) => {
                if (error) {
                    reject(error);
                } else {
                    var statusCode = Constants.HTTP_STATUS.SUCCESS.OK.statusCode;
                    if (!data._id) {
                        statusCode = Constants.HTTP_STATUS.CLIENT_ERROR.NOT_FOUND.statusCode;
                    }
                    resolve(h.response(data).code(statusCode).header('Content-Type', 'application/json'));
                }
            }

            Controller.UserController.deleteSingleUser(request.params.userId, request.auth.credentials, responseCallback);
        });
    }
}


const UserRoutes = [
    getUser,
    getAllUsers,
    registerUser,
    deleteSingleUser
];

module.exports = UserRoutes;