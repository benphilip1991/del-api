/**
 * Auth utils for generating, validating and managing
 * auth tokens
 * 
 * @author Ben Philip
 */
'use strict';

const JsonWebToken = require('jsonwebtoken');
const Constants = require('../config/constants');

/**
 * Generate auth token for user
 * @param {*} userId 
 */
const generateToken = (userId) => {

    const token = JsonWebToken.sign({ userId }, Constants.JWT_SECRETS.JWT_SECRET_KEY, {
        algorithm: Constants.JWT_SECRETS.JWT_ALGORITHM,
        expiresIn: Constants.JWT_SECRETS.JWT_DEFAULT_EXPIRY
    });

    return token;
}

/**
 * Verify given token
 * @param {*} token 
 */
const verifyToken = (token) => {

    try {
        return JsonWebToken.verify(token, Constants.JWT_SECRETS.JWT_SECRET_KEY);
    } catch (e) {
        console.log(`Invalid token`);
    }
}

const verifyUserRole = (userId, roleRequired) => {
    ;
}

module.exports = {
    generateToken: generateToken,
    verifyToken: verifyToken,
    verifyUserRole: verifyUserRole
}