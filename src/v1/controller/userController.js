/**
 * User controller
 * 
 * @author Ben Philip
 */
'use strict';

const async = require('async');
const Boom = require('@hapi/boom');
const Moment = require('moment');
const Utils = require('../utils/delUtils');
const Services = require('../services');
const Constants = require('../config/constants');

/**
 * POST user controller - creates one record for a new user.
 * Only admins and caregivers can use this API and by default,
 * a patient is created unless specified in the payload
 * 
 * Patients cannot create other accounts
 * Caregivers can only create patient accounts
 * 
 * @param {*} payload 
 * @param {*} credential
 * @param {*} callback 
 */
const registerUser = (payload, credentials, callback) => {
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

            // Patients are not permitted to create other accounts
            if (credentials.userRole == Constants.USER_ROLES.PATIENT) {
                asyncCallback(Boom.forbidden(Constants.MESSAGES.ACTION_NOT_PERMITTED));
            } else if (credentials.userRole == Constants.USER_ROLES.CAREGIVER
                && payload.userRole != Constants.USER_ROLES.PATIENT) {

                // Caregivers can only create patients
                asyncCallback(Boom.forbidden(Constants.MESSAGES.ACTION_NOT_PERMITTED));
            } else {
                Services.userServices.getSingleUser(query, projection, {}, (err, data) => {
                    if (err) {
                        asyncCallback(err);
                    } else {
                        //data.hasOwnProperty("_id") not working
                        if (null !== data && data._id) {
                            // if the user exists and is active, return a conflict
                            if (!data.deleteFlag) {
                                asyncCallback(Boom.conflict(`User ${payload.emailId} already exists.`));
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
            }
        },
        task2_registerUser: (asyncCallback) => {
            if (payload.password) {
                payload.password = Utils.encryptPassword(payload.password);
            }
            // Add additional details - creationDate, userRole and deleteFlag
            payload.deleteFlag = false;
            payload.deletable = true;
            payload.creationDate = Moment().utc().valueOf();
            if (!payload.userRole) {
                payload.userRole = Constants.USER_ROLES.PATIENT;
            }

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
 * Delete single - updates the deleteFlag for the user to true. 
 * Users are not permanently deleted from the system.
 * Only deletable users are effected.
 * Patients cannot delete any account.
 * Caregivers can only delete patient accounts
 * 
 * @param {*} userId 
 * @param {*} credential
 * @param {*} callback 
 */
const deleteSingleUser = (userId, credentials, callback) => {
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

            // Patient users are not permitted to delete users
            if (credentials.userRole == Constants.USER_ROLES.PATIENT) {
                asyncCallback(Boom.forbidden(Constants.MESSAGES.ACTION_NOT_PERMITTED));
            } else {
                Services.userServices.getSingleUser(query, projection, {}, (err, data) => {
                    if (err) {
                        asyncCallback(err);
                    } else {
                        // Not found
                        if (null == data) {
                            asyncCallback(Boom.notFound(`User ${userId} does not exist`));
                        } else if (!data.deletable) {
                            // Non deletable user
                            asyncCallback(Boom.forbidden(`User ${userId} cannot be deleted`));
                        } else {
                            // User found. Check permissions
                            if (credentials.userRole == Constants.USER_ROLES.CAREGIVER
                                && data.userRole != Constants.USER_ROLES.PATIENT) {
                                asyncCallback(Boom.forbidden(Constants.MESSAGES.ACTION_NOT_PERMITTED));
                            } else {
                                asyncCallback();
                            }
                        }
                    }
                });
            }
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
 * Get single user if the id is valid.
 * Patients can only get their own data.
 * Caregivers can only get their own or patient data.
 * Access to admin details are restricted.
 * 
 * @param {*} userId 
 * @param {*} credentials
 * @param {*} callback 
 */
const getSingleUser = (userId, credentials, callback) => {
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
                deleteFlag: 0,
                deletable: 0
            };

            if (credentials.userRole == Constants.USER_ROLES.PATIENT
                && userId != credentials.userId) {
                // Patients can only get their own details
                asyncCallback(Boom.forbidden(Constants.MESSAGES.ACTION_NOT_PERMITTED));
            } else {
                Services.userServices.getSingleUser(query, projection, {}, (err, data) => {
                    if (err) {
                        asyncCallback(err);
                    } else {
                        if (null != data) {
                            if (credentials.userRole == Constants.USER_ROLES.CAREGIVER
                                && data.userRole == Constants.USER_ROLES.ADMIN) {
                                asyncCallback(Boom.forbidden(Constants.MESSAGES.ACTION_NOT_PERMITTED));
                            } else {
                                singleUser = data;
                                asyncCallback(null, singleUser);
                            }
                        }
                    }
                });
            }
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
 * Get all registered users.
 * Patients do not have access to this API.
 * Caregivers can only get other caregivers and patients.
 * 
 * @param {*} credentials
 * @param {*} callback 
 */
const getAllUsers = (credentials, callback) => {
    var userList = {};
    const seriesTasks = {
        task1_getAllUsers: (asyncCallback) => {
            if (credentials.userRole == Constants.USER_ROLES.PATIENT) {
                asyncCallback(Boom.forbidden(Constants.MESSAGES.ACTION_NOT_PERMITTED));
            } else {
                let query = {
                    deleteFlag: false
                }
                let projection = {
                    __v: 0,
                    password: 0,
                    deleteFlag: 0,
                    deletable: 0
                };

                if (credentials.userRole == Constants.USER_ROLES.CAREGIVER) {
                    query.$or = [
                        { userRole: Constants.USER_ROLES.CAREGIVER },
                        { userRole: Constants.USER_ROLES.PATIENT }
                    ]
                }

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
