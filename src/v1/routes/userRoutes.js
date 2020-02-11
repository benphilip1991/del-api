/**
 * Routes for the user resource
 * 
 * @author Ben Philip
 */
'use strict';

const Joi = require('@hapi/joi');
const Moment = require('moment');
const Mongoose = require('mongoose');
const Controller = require('../controller');
const Constants = require('../config/constants');
const utils = require('../utils/delUtils');

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
        description: 'Get single user details',
        tags: ['api', 'user'],
        validate: {
            params: {
                userId: Joi.string().trim().regex(/^[a-zA-Z0-9]+$/)
            }
        }
    },
    handler: (request, h) => {

        console.log('[INFO]', `${Moment()} --> ${request.method.toUpperCase()} ${request.path}`);

        // Verify if userId is an objectId, else reject
        if (!Mongoose.Types.ObjectId.isValid(request.params.userId)) {
            console.log('[INFO]', `${Moment()} --> Invalid UserId`)

            var statusCode = Constants.HTTP_STATUS.CLIENT_ERROR.BAD_REQUEST.statusCode;
            var response = {
                message: "Invalid user ID"
            }
            var errorResponse = h.response(response);
            errorResponse.code(statusCode);
            errorResponse.header('Content-Type', 'application/json');
            return errorResponse;
        }

        // Return user details
        return new Promise((resolve, reject) => {

            // Response callback
            const responseCallback = (error, data) => {
                if (error) {
                    console.log(`${Moment()} Error in Getting specific user`);
                    var statusCode = Constants.HTTP_STATUS.SERVER_ERROR.INTERNAL_SERVER_ERROR.statusCode;
                    reject(
                        h.response(
                            utils.buildErrorResponse(error)).
                            code(statusCode).header('Content-Type', 'application/json')
                    );
                } else {
                    var statusCode = Constants.HTTP_STATUS.SUCCESS.OK.statusCode;
                    if (!data._id) {
                        statusCode = Constants.HTTP_STATUS.CLIENT_ERROR.NOT_FOUND.statusCode;
                    }
                    resolve(h.response(data).code(statusCode).header('Content-Type', 'application/json'));
                }
            }
            Controller.UserController.getSingleUser(request.params.userId, responseCallback);
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
        description: 'Get all user records',
        tags: ['api', 'user']
    },
    handler: (request, h) => {

        console.log('[INFO]', `${Moment()} --> ${request.method.toUpperCase()} ${request.path}`);

        return new Promise((resolve, reject) => {

            // Response callback
            const responseCallback = (error, data) => {
                if (error) {
                    console.log(`${Moment()} Error getting users`);
                    var statusCode = Constants.HTTP_STATUS.SERVER_ERROR.INTERNAL_SERVER_ERROR.statusCode;
                    reject(
                        h.response(utils.buildErrorResponse(error)).
                            code(statusCode).header('Content-Type', 'application/json')
                    );
                } else {
                    var statusCode = Constants.HTTP_STATUS.SUCCESS.OK.statusCode;

                    // Empty user list
                    if (!data.users) {
                        statusCode = Constants.HTTP_STATUS.CLIENT_ERROR.NOT_FOUND.statusCode;
                    }
                    resolve(h.response(data).code(statusCode).header('Content-Type', 'application/json'));
                }
            }
            Controller.UserController.getAllUsers(responseCallback);
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
        description: "Register new user",
        tags: ['api', 'user'],
        validate: {
            payload: {
                firstName: Joi.string().required().trim().regex(/^[a-zA-Z ]+$/),
                lastName: Joi.string().required().trim().regex(/^[a-zA-Z ]+$/),
                emailId: Joi.string().email().required().trim(),
                age: Joi.number().required(),
                sex: Joi.string().required().regex(/^[a-zA-Z ]+$/).max(6),
                password: Joi.string().required().trim().min(6),
                creationDate: Joi.any().forbidden(),
                deleteFlag: Joi.any().forbidden()
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

            Controller.UserController.registerUser(request.payload, responseCallback);
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
        description: 'Delete existing user - soft deletion of user record',
        tags: ['api', 'user'],
        validate: {
            params: {
                userId: Joi.string().trim().regex(/^[a-zA-Z0-9]+$/)
            }
        }
    },
    handler: (request, h) => {

        console.log('[INFO]', `${Moment()} --> ${request.method.toUpperCase()} ${request.path}`);

        // Verify if userId is an objectId, else reject
        if (!Mongoose.Types.ObjectId.isValid(request.params.userId)) {
            console.log('[INFO]', `${Moment()} --> Invalid UserId`)

            var statusCode = Constants.HTTP_STATUS.CLIENT_ERROR.BAD_REQUEST.statusCode;
            var response = {
                message: "Invalid user ID"
            }
            var errorResponse = h.response(response);
            errorResponse.code(statusCode);
            errorResponse.header('Content-Type', 'application/json');
            return errorResponse;
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

            Controller.UserController.deleteSingleUser(request.params.userId, responseCallback);
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