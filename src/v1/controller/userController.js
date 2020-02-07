/**
 * User controller
 * 
 * @author Ben Philip
 */
'use strict';

const async = require('async');
const utils = require('../utils/delUtils');
const Services = require('../services');
const Constants = require('../config/constants');

/**
 * POST user controller - creates one record for a 
 * new user
 * 
 * @param {*} payload 
 * @param {*} callback 
 */
const registerUser = (payload, callback) => {
    var createdUser = {};
    const seriesTasks = {
        task1_checkUserExists: (asyncCallback) => {
            let query = {
                emailId: payload.emailId
            };
            let projection = {
                __v: 0,
                password: 0
            };

            Services.userServices.getSingleUser(query, projection, {}, (err, data) => {
                if(err) {
                    asyncCallback(err);
                } else {
                    
                    //data.hasOwnProperty("_id") not working
                    if(null!== data && data._id) {
                        let conflictBody = {
                            statusCode: Constants.HTTP_STATUS.CLIENT_ERROR.CONFLICT.statusCode,
                            message: `User ${payload.emailId} already exists.`
                        }
                        asyncCallback(conflictBody);
                    } else {
                        // User doesn't exist; create using task2
                        asyncCallback();
                    }
                }
            });
        },
        task2_registerUser: (asyncCallback) => {
            if (payload.password) {
                payload.password = utils.encryptPassword(payload.password);
            }
            // Mongoose returns created object in the data parameter
            Services.userServices.createNewUser(payload, (err, data) => {
                if(err) {
                    asyncCallback(err);
                } else {
                    createdUser = {
                        _id: data._id,
                        firstName: data.firstName,
                        lastName: data.lastName,
                        emailId: data.emailId
                    }
                    asyncCallback();
                }
            })
        }
    }

    async.series(seriesTasks, (err) => {
        if(err) {
            callback(err, null);
        } else {
            callback(null, createdUser);
        }
    });
}

/**
 * Get single user if the id is valid
 * 
 * @param {*} userId 
 * @param {*} callback 
 */
const getSingleUser = (userId, callback) => {
    var singleUser = {};
    const seriesTasks = {
        task1_getSingleUser: (asyncCallback) => {
            let query = {
                _id: userId
            };
            let projection = {
                __v: 0,
                password: 0,
                deleteFlag: 0
            };

            Services.userServices.getSingleUser(query, projection, {}, (err, data) => {
                if(err) {
                    asyncCallback(err);
                } else {
                    if(null != data) {
                        singleUser = data;
                    }
                    asyncCallback();
                }
            });
        }
    }

    // Perform series operation
    async.series(seriesTasks, (err) => {
        if(err) {
            callback(err);
        } else {
            callback(null, singleUser);
        }
    });
}

/**
 * Get all registered users
 * 
 * @param {*} callback 
 */
const getAllUsers = (callback) => {
    ;
}

module.exports = {
    registerUser: registerUser,
    getSingleUser: getSingleUser,
    getAllUsers: getAllUsers
}
