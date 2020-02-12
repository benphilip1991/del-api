/**
 * Authentication APIs for generating and validating
 * user credentials and tokens
 * 
 * @author Ben Philip
 */
'use strict';

const Joi = require('@hapi/joi');
const Boom = require('@hapi/boom');
const Moment = require('moment');
const Controller = require('../controller');
const Constants = require('../config/constants');
const utils = require('../utils/delUtils');

/**
 * Generate Auth Token
 */
const generateAuthToken = {
    method: 'POST',
    path: '/api/v1/auth',
    config: {
        description: 'Generate new auth token',
        tags: ['api', 'auth'],
        validate: {
            payload: {
                emailId: Joi.string().email().required().trim(),
                password: Joi.string().required().trim().min(6)
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
                    var statusCode = Constants.HTTP_STATUS.SUCCESS.OK.statusCode;
                    resolve(h.response(data).code(statusCode).header('Content-Type', 'application/json'));
                }
            }
            Controller.AuthController.generateToken(request.payload, responseCallback);
        });
    }
}

module.exports = [generateAuthToken];
