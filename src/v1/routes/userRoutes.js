/**
 * Routes for the user resource
 * 
 * @author Ben Philip
 */
'use strict';

const Joi = require('joi');
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

            var errorResponse = h.response(utils.buildErrorResponse(
                Constants.HTTP_STATUS.CLIENT_ERROR.BAD_REQUEST));
            errorResponse.code(Constants.HTTP_STATUS.CLIENT_ERROR.BAD_REQUEST.statusCode);
            errorResponse.header('Content-Type', 'application/json');
            return errorResponse;
        }

        // Return user details
        return new Promise((resolve, reject) => {

            // Response callback
            const responseCallback = (error, data) => {
                if (error) {
                    console.log("Error in Getting specific user")
                    reject(
                        h.response(
                            utils.buildErrorResponse(error)
                        ).code(Constants.HTTP_STATUS.SERVER_ERROR.INTERNAL_SERVER_ERROR.statusCode).header('Content-Type', 'application/json')
                    );
                } else {
                    var statusCode = Constants.HTTP_STATUS.SUCCESS.OK.statusCode;
                    if(!data._id) {
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
    handler: (request, h) => {

        console.log('[INFO]', `${Moment()} --> ${request.method.toUpperCase()} ${request.path}`);

        var response = h.response("getAllUsers");
        response.code(Constants.HTTP_STATUS.SUCCESS.OK.statusCode);
        response.header('Content-Type', 'application/json');
        return response;
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
        description: "DEL user registration",
        tags: ["user", "create"],
        validate: {
            payload: {
                firstName: Joi.string().required().trim().regex(/^[a-zA-Z ]+$/),
                lastName: Joi.string().required().trim().regex(/^[a-zA-Z ]+$/),
                emailId: Joi.string().required().trim(),
                age: Joi.number().required(),
                sex: Joi.string().required().regex(/^[a-zA-Z ]+$/).max(6),
                password: Joi.string().required().min(6),
                creationDate: Joi.any().forbidden()
            }
        }
    },
    handler: (request, h) => {
        console.log('[INFO]', `${Moment()} --> ${request.method.toUpperCase()} ${request.path}`);

        return new Promise((resolve, reject) => {
            const responseCallback = (error, data) => {
                if (error) {
                    // If a custom error is sent, resolve it
                    if (error.statusCode) {
                        resolve(h.response(
                            utils.buildErrorResponse(error)
                        ).code(error.statusCode).header('Content-Type', 'application/json'));
                    } else {
                        reject(
                            h.response(
                                utils.buildErrorResponse(error)
                            ).code(error.statusCode).header('Content-Type', 'application/json')
                        );
                    }
                } else {

                    // Created successfully
                    resolve(
                        h.response(data).
                            code(Constants.HTTP_STATUS.SUCCESS.CREATED.statusCode).header('Content-Type', 'application/json')
                    );
                }
            }

            Controller.UserController.registerUser(request.payload, responseCallback);
        });
    }
}

const UserRoutes = [
    getUser,
    getAllUsers,
    registerUser
];

module.exports = UserRoutes;