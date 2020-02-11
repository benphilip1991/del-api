/**
 * Controllers for managing token generation and
 * storage.
 * 
 * @author Ben Philip
 */
'use strict';

const async = require('async');
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
    const seriesTasks = {
        task1_checkUserExists: (asyncCallback) => {
            Services.userServices.getSingleUser(query, {}, {}, (err, data) => {
                if(err) {
                    asyncCallback(err);
                } else {
                    if(null != data && data._id) {
                        // User exists; validate password
                        if(Utils.DelUtils.verifyPassword(payload.password, data.password)) {
                            // Validated
                            console.log(`${Moment()} Password validated`);
                            userId = data._id;
                            asyncCallback();
                        } else {
                            let unauthorizedBody = {
                                statusCode: Constants.HTTP_STATUS.CLIENT_ERROR.UNAUTHORIZED.statusCode,
                                message: Constants.HTTP_STATUS.CLIENT_ERROR.UNAUTHORIZED.defaultMessage
                            }

                            asyncCallback(unauthorizedBody);
                        }
                    }
                }
            });
        },
        task2_generateToken: (asyncCallback) => {
            
            console.log(`${Moment()} Generating token for user ${userId}`)
             // Using userId for token generation
            token = {
                bearer: Utils.AuthUtils.generateToken(userId)
            }
            asyncCallback();
        },
        task3_storeToken: (asyncCallback) => {

            console.log(`Validating : ${JSON.stringify(Utils.AuthUtils.verifyToken(token.bearer))}`);
            asyncCallback();
        }
    }

    async.series(seriesTasks, (err) => {
        if(err) {
            callback(err);
        } else {
            callback(null, token)
        }
    })
}

module.exports = {
    generateToken
}