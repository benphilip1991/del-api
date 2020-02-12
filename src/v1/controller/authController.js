/**
 * Controllers for managing token generation and
 * storage.
 * 
 * @author Ben Philip
 */
'use strict';

const async = require('async');
const Boom = require('@hapi/boom');
const Moment = require('moment');
const Utils = require('../utils');
const Services = require('../services');
const Constants = require('../config/constants');

/**
 * Controller to validate users, generate and return
 * JWT tokens.
 * 
 * @param {*} payload 
 * @param {*} callback 
 */
const generateToken = (payload, callback) => {
    var token = {};
    let query = {
        emailId: payload.emailId
    }
    let userId = '';
    let userRole = '';
    const seriesTasks = {
        task1_checkUserExists: (asyncCallback) => {

            Services.userServices.getSingleUser(query, {}, {}, (err, data) => {
                if (err) {
                    asyncCallback(err);
                } else {
                    if (null != data && data._id) {
                        // User exists; validate password
                        if (Utils.DelUtils.verifyPassword(payload.password, data.password)) {
                            // Validated
                            console.log(`${Moment()} Password validated`);
                            userId = data._id;
                            userRole = data.userRole;
                            asyncCallback();
                        } else {
                            asyncCallback(Boom.unauthorized("Invalid Email or Password"));
                        }
                    } else {
                        asyncCallback(Boom.unauthorized("Invalid email or Password"));
                    }
                    // Need to call the above callback in the else blocks,
                    // else the asyncCallback is called twice - crash on async
                }
            });
        },
        task2_clearPreviousToken: (asyncCallback) => {
            let tokenQuery = {
                userId: userId
            }
            Services.userAuthServices.deleteUserToken(tokenQuery, (err, data) => {
                if (err) {
                    asyncCallback(err);
                } else {
                    // if token exists, data.deletedCount = 1; else 0
                    asyncCallback();
                }
            });
        },
        task3_generateToken: (asyncCallback) => {
            console.log(`${Moment()} Generating token for user ${userId}`)
            // Using userId for token generation
            token.bearer = Utils.AuthUtils.generateToken(userId, userRole);
            asyncCallback();
        },
        task4_storeToken: (asyncCallback) => {
            // AuthModel takes userId, token
            let userTokenMap = {
                userId: userId,
                token: token.bearer
            }
            Services.userAuthServices.setUserToken(userTokenMap, (err, data) => {
                if (err) {
                    asyncCallback(err)
                } else {
                    asyncCallback(null, token);
                }
            });
        }
    }

    async.series(seriesTasks, (err) => {
        if (err) {
            callback(err);
        } else {
            callback(null, token)
        }
    })
}

module.exports = {
    generateToken
}