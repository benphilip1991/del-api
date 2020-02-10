/**
 * User controller
 * 
 * @author Ben Philip
 */
'use strict';

const async = require('async');
const Moment = require('moment');
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
    let query = {
        emailId: payload.emailId,
    };
    var userExists = false;
    const seriesTasks = {
        task1_checkUserExists: (asyncCallback) => {
            let projection = {
                __v: 0,
                password: 0
            };

            Services.userServices.getSingleUser(query, projection, {}, (err, data) => {
                if (err) {
                    asyncCallback(err);
                } else {

                    //data.hasOwnProperty("_id") not working
                    if (null !== data && data._id) {

                        // if the user exists and is active, return a conflict
                        if (!data.deleteFlag) {
                            let conflictBody = {
                                statusCode: Constants.HTTP_STATUS.CLIENT_ERROR.CONFLICT.statusCode,
                                message: `User ${payload.emailId} already exists.`
                            }
                            asyncCallback(conflictBody);
                        } else {
                            userExists = true;
                            asyncCallback();
                        }
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
            // Add additional details - creationDate, userRole and deleteFlag
            payload.deleteFlag = false;
            payload.creationDate = Moment().utc().valueOf();
            payload.userRole = Constants.USER_ROLES.PATIENT;

            if (!userExists) {
                // Mongoose returns created object in the data parameter
                Services.userServices.createNewUser(payload, (err, data) => {
                    if (err) {
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
                });
            } else {
                // Update user and restore account
                console.log(`${Moment()} User exists. Restoring account and updating details.`)
                Services.userServices.updateSingleUser(query, payload, { upsert: false }, (err, data) => {
                    if (err) {
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
    }

    async.series(seriesTasks, (err) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, createdUser);
        }
    });
}


/**
 * Delete single - updates the deleteFlag
 * for the user to true. Users are not permanently
 * deleted from the system
 * 
 * @param {*} userId 
 * @param {*} callback 
 */
const deleteSingleUser = (userId, callback) => {
    var deletedUser = {};
    let query = {
        _id: userId,
        deleteFlag: false
    };
    const seriesTasks = {
        task1_checkUserExists: (asyncCallback) => {
            let projection = {
                __v: 0,
                password: 0
            };

            Services.userServices.getSingleUser(query, projection, {}, (err, data) => {
                if (err) {
                    asyncCallback(err);
                } else {
                    // Not found
                    if (null == data) {
                        let notFoundBody = {
                            statusCode: Constants.HTTP_STATUS.CLIENT_ERROR.NOT_FOUND.statusCode,
                            message: `User ${userId} does not exist`
                        }
                        asyncCallback(notFoundBody);
                    } else {
                        // User found
                        asyncCallback();
                    }
                }
            });
        },
        task2_deleteUser: (asyncCallback) => {
            let updateData = {
                deleteFlag: true
            }
            Services.userServices.updateSingleUser(query, updateData, { upsert: false }, (err, data) => {
                if (err) {
                    asyncCallback(err)
                } else {
                    deletedUser._id = data._id;
                    asyncCallback();
                }
            })
        }
    }

    async.series(seriesTasks, (err) => {
        if (err) {
            callback(err);
        } else {
            callback(null, deletedUser)
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
                _id: userId,
                deleteFlag: false
            };
            let projection = {
                __v: 0,
                password: 0,
                deleteFlag: 0
            };

            Services.userServices.getSingleUser(query, projection, {}, (err, data) => {
                if (err) {
                    asyncCallback(err);
                } else {
                    if (null != data) {
                        singleUser = data;
                    }
                    asyncCallback();
                }
            });
        }
    }

    // Perform series operation
    async.series(seriesTasks, (err) => {
        if (err) {
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
    var userList = {};
    const seriesTasks = {
        task1_getAllUsers: (asyncCallback) => {
            let query = {
                deleteFlag: false
            }
            let projection = {
                __v: 0,
                password: 0,
                deleteFlag: 0
            };

            Services.userServices.getAllUsers(query, projection, {}, (err, data) => {
                if (err) {
                    asyncCallback(err);
                } else {
                    if (null != data && data.length != 0) {
                        userList.users = data;
                    }
                    asyncCallback();
                }
            });
        }
    }

    // Fetch all users
    async.series(seriesTasks, (err) => {
        if (err) {
            callback(err);
        } else {
            callback(null, userList);
        }
    })
}

module.exports = {
    registerUser: registerUser,
    deleteSingleUser: deleteSingleUser,
    getSingleUser: getSingleUser,
    getAllUsers: getAllUsers
}
