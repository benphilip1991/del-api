/**
 * Supporting utilities for common functions
 * 
 * @author Ben Philip
 */
'use strict';

const Boom = require('@hapi/boom');
const Moment = require('moment');
const BCrypt = require('bcrypt');
const Constants = require('../config/constants');

const returnError = (data) => {
    console.log(data)
}

/**
 * Encrypt password using BCrypt
 * @param {*} plaintextPassword 
 */
const encryptPassword = (plaintextPassword) => {

    const saltRounds = 10;
    return BCrypt.hashSync(plaintextPassword, saltRounds);
}

/**
 * Compare encrypted and plain passwords
 * @param {String} pPassword 
 * @param {String} ePassword 
 */
const verifyPassword = (pPassword, ePassword) => {
    return (BCrypt.compareSync(pPassword, ePassword));
}

/**
 * Build error responses for bad API call outcomes
 * @param {*} data 
 */
const buildErrorResponse = (data) => {

    // Default or provided error data
    if (typeof data == 'object') {
        if (data.hasOwnProperty('statusCode') && data.hasOwnProperty('message')) {
            return data;
        }
    } else {
        console.log("Default error")
        return {
            statusCode: Constants.HTTP_STATUS.SERVER_ERROR.INTERNAL_SERVER_ERROR.statusCode,
            message: Constants.HTTP_STATUS.SERVER_ERROR.INTERNAL_SERVER_ERROR.defaultMessage
        }
    }

}

/**
 * Build error response for unauthorized requests
 * @param {*} data 
 */
const buildUnauthorizedResponse = (data) => {

}

/**
 * Build success response message for good API outcomes
 * @param {*} message 
 * @param {*} data 
 */
const buildSuccessResponse = (message, data) => {

    let responseMessage = message || Constants.HTTP_STATUS.SUCCESS.OK.defaultMessage;
    if (typeof responseMessage == 'object') {

    } else {
        return {

        };
    }
}

module.exports = {
    returnError: returnError,
    encryptPassword: encryptPassword,
    verifyPassword: verifyPassword,
    buildErrorResponse: buildErrorResponse,
    buildUnauthorizedResponse: buildUnauthorizedResponse,
    buildSuccessResponse: buildSuccessResponse
}