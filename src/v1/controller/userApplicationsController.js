/**
 * Controller for managing applications linked to
 * a particular user.
 * 
 * @author Ben Philip
 */
'use strict';

const async = require('async');
const Boom = require('@hapi/boom');
const Moment = require('moment');
const Services = require('../services');
const Constants = require('../config/constants');

/**
 * Get all applications linked to a given user
 * profile.
 * Admins and caregivers can get details for all users
 * Users can get only their details
 * 
 * @param {string} userId 
 * @param {object} credentials 
 * @param {function(err, data)} callback 
 */
const getAllUserApplications = (userId, credentials, callback) => {
    var userApplications = {};
    const seriesTasks = {
        task1_checkUserExists: (asyncCallback) => {
            let userQuery = {
                _id: userId,
                deleted: false
            };
            let projection = {
                __v: 0,
                password: 0
            }

            // Patients can only get their details. Developers are not permitted to get any details
            if ((credentials.userRole == Constants.USER_ROLES.PATIENT && credentials.userId != userId)
                || credentials.userRole == Constants.USER_ROLES.DEVELOPER) {

                asyncCallback(Boom.forbidden(Constants.MESSAGES.ACTION_NOT_PERMITTED));
            } else {
                // Unauthorized requesting users filtered. Check if user exists
                Services.userServices.getSingleUser(userQuery, projection, {}, (err, data) => {
                    if (err) {
                        asyncCallback(err);
                    } else {
                        if (null == data) {
                            asyncCallback(Boom.notFound(`User ${userId} not found`));
                        } else {
                            asyncCallback();
                        }
                    }
                });
            }
        },
        task2_getUserApplicationList: (asyncCallback) => {
            let userApplicationQuery = {
                userId: userId
            };
            let projection = {
                _id: 0,
                __v: 0
            }

            Services.userApplicationServices.getAllUserApplications(userApplicationQuery, projection, {}, (err, data) => {
                if (err) {
                    asyncCallback(err);
                } else {
                    userApplications = data;
                    asyncCallback();
                }
            });
        }
    }

    // Perform series tasks
    async.series(seriesTasks, (err) => {
        if (err) {
            callback(err);
        } else {
            callback(null, userApplications);
        }
    })
}

/**
 * Update the list of applications associated to a user.
 * Operations include linking new applications and removing
 * linked applications.
 * Admins and caregivers can update app details for all users
 * Users can only update their own services.
 * 
 * @param {string} userId 
 * @param {object} payload 
 * @param {object} credentials 
 * @param {function(err, data)} callback 
 */
const updateUserApplication = (userId, payload, credentials, callback) => {
    var userApplications = {};
    const seriesTasks = {
        task1_checkUserExists: (asyncCallback) => {
            let userQuery = {
                _id: userId,
                deleted: false
            };
            let projection = {
                __v: 0,
                password: 0
            }

            // Patients can only get their details. Developers are not permitted to get any details
            if ((credentials.userRole == Constants.USER_ROLES.PATIENT && credentials.userId != userId)
                || credentials.userRole == Constants.USER_ROLES.DEVELOPER) {

                asyncCallback(Boom.forbidden(Constants.MESSAGES.ACTION_NOT_PERMITTED));
            } else {
                // Unauthorized requesting users filtered. Check if user exists
                Services.userServices.getSingleUser(userQuery, projection, {}, (err, data) => {
                    if (err) {
                        asyncCallback(err);
                    } else {
                        if (null == data) {
                            asyncCallback(Boom.notFound(`User ${userId} not found`));
                        } else {
                            asyncCallback();
                        }
                    }
                });
            }
        },
        task2_getUserApplicationList: (asyncCallback) => {
            let userApplicationQuery = {
                userId: userId
            };
            let projection = {
                _id: 0,
                __v: 0
            }

            Services.userApplicationServices.getAllUserApplications(userApplicationQuery, projection, {}, (err, data) => {
                if (err) {
                    asyncCallback(err);
                } else {
                    userApplications = data;
                    asyncCallback();
                }
            });
        },
        task3_validateApplication: (asyncCallback) => {
            // UserApplications contains existing application details.
            // If adding new apps, check if they are valid
            if (payload.operation == Constants.APP_OPERATIONS.ADD) {
                let appQuery = {
                    _id: payload.applicationId,
                    deleted: false
                };
                // Check if application is already linked
                var foundApplication = false;
                userApplications.applications.forEach(application => {
                    if (application.applicationId == payload.applicationId) {
                        foundApplication = true;
                    }
                });
                if (foundApplication) {
                    asyncCallback(Boom.badRequest(`Application ${payload.applicationId} already linked.`));
                } else {
                    Services.applicationServices.getApplicationDetails(appQuery, {}, {}, (err, data) => {
                        if (err) {
                            asyncCallback(err);
                        } else {
                            if (null != data && data._id) {
                                //found application
                                let newApplication = {
                                    applicationId: data._id,
                                    addedBy: credentials.userId,
                                    addedOn: Moment().utc().valueOf()
                                }
                                userApplications.applications.push(newApplication);
                                asyncCallback();
                            } else {
                                asyncCallback(Boom.badRequest(`Invalid application ${payload.applicationId}`));
                            }
                        }
                    });
                }
            } else {
                // Deletion operation. Check if applicationId exists in user list
                var foundApplication = false;
                userApplications.applications.forEach((application, index, newAppList) => {
                    if (application.applicationId == payload.applicationId) {
                        newAppList.splice(index, 1);
                        foundApplication = true;
                    }
                });
                if (foundApplication) {
                    asyncCallback();
                } else {
                    // Invalid applicationId
                    asyncCallback(Boom.badRequest(`Application ${payload.applicationId} not linked`));
                }
            }
        },
        task4_updateApplicationList: (asyncCallback) => {
            let query = {
                userId: userId
            };
            Services.userApplicationServices.updateUserApplicationList(query, userApplications, (err, data) => {
                if (err) {
                    asyncCallback(err);
                } else {
                    asyncCallback();
                }
            });
        }
    }

    // Perform update
    async.series(seriesTasks, (err) => {
        if (err) {
            callback(err);
        } else {
            callback(null, userApplications)
        }
    });
}

module.exports = {
    getAllUserApplications: getAllUserApplications,
    updateUserApplication: updateUserApplication
}