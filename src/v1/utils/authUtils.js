/**
 * Auth utils for generating, validating and managing
 * auth tokens
 * 
 * @author Ben Philip
 */
'use strict';

const JsonWebToken = require('jsonwebtoken');
const Constants = require('../config/constants');
const Services = require('../services');

/**
 * Generate auth token for user
 * @param {String} userId 
 * @param {String} userRole
 */
const generateToken = (userId, userRole) => {

    const token = JsonWebToken.sign(
        {
            userId: userId,
            userRole: userRole
        },
        Constants.JWT_SECRETS.JWT_SECRET_KEY,
        {
            algorithm: Constants.JWT_SECRETS.JWT_ALGORITHM,
            expiresIn: Constants.JWT_SECRETS.JWT_DEFAULT_EXPIRY
        }
    );

    return token;
}

/**
 * Verify given token
 * @param {String} token 
 */
const verifyToken = (token) => {

    try {
        let tokenDetails = JsonWebToken.verify(token, Constants.JWT_SECRETS.JWT_SECRET_KEY);
        return tokenDetails;
    } catch (e) {
        console.log(`Invalid token`);
        if (null != token && null != JsonWebToken.decode(token)) {
            deleteToken(JsonWebToken.decode(token).userId, token);
        }
    }
}

const verifyUserRole = (userId, roleRequired) => {
    ;
}

/**
 * Delete recorded token for a given
 * user
 * @param {String} userId
 * @param {String} token
 */
const deleteToken = (userId, token) => {
    Services.userAuthServices.deleteUserToken(
        { userId: userId, token: token }, (err, data) => {
        if (err) {
            console.log(err);
        }
    });
}

module.exports = {
    generateToken: generateToken,
    verifyToken: verifyToken,
    verifyUserRole: verifyUserRole
}