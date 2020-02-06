/**
 * Routes for the user resource
 * 
 * @author Ben Philip
 */
'use strict';

const Joi = require('joi');
const Moment = require('moment');

/**
 * Route definitions and Joi validation for users
 */

/**
 * Get specific user
 */
const getUser = {
    method: 'GET',
    path: '/api/v1/user/{userId}',
    handler: (request, h) => {
        var mockedUser = {};
        if (request.params.userId == '123') {
            mockedUser = {
                "userId": request.params.userId,
                "emailId": "test@test.com",
                "firstName": "John",
                "lastName": "Doe",
                "age": 45,
                "sex": "Male",
            }
        }

        console.log('[INFO]', `${Moment()} --> ${request.method.toUpperCase()} ${request.path}`);

        var response = h.response(mockedUser);
        response.code(200);
        response.header('Content-Type', 'application/json');
        return response;
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
        response.code(200);
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
        console.log(JSON.stringify(request.payload));

        return new Promise((resolve, reject) => {
            resolve("Created");
        })
    }
}


const UserRoutes = [
    getUser,
    getAllUsers,
    registerUser
];

module.exports = UserRoutes;