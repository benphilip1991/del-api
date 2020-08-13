/**
 * Application controller for managing applications
 * that will be linked to user profiles and run on
 * the mobile container.
 * 
 * @author Ben Philip
 */
'use strict';

const async = require('async');
const Boom = require('@hapi/boom');
const Moment = require('moment');
const Services = require('../services');
const Utils = require('../utils/delUtils');
const Constants = require('../config/constants');

/**
 * Get details for a given application.
 * Only registered platform users are permitted to fetch
 * app details. Unregistered users are filtered off at the
 * route filter.
 * 
 * @param {string} applicationId  
 * @param {function(err, data)} callback 
 */
const getSingleApplicationDetails = (applicationId, callback) => {
    var application = {};
    const seriesTasks = {
        task1_getSingleApplicationDetails: (asyncCallback) => {
            let query = {
                _id: applicationId,
                deleted: false
            };
            let projection = {
                __v: 0,
                deleted: 0
            };

            // Unauthorized users already blocked at the route filter
            Services.applicationServices.getApplicationDetails(query, projection, {}, (err, data) => {
                if (err) {
                    asyncCallback(err);
                } else {
                    if (null != data) {
                        application = data;
                    }
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
            callback(null, application);
        }
    })
}

/**
 * Get details for all registered applications
 * Only registered platform users are permitted to fetch
 * app details. Unregistered users are filtered off at the
 * route filter.
 * 
 * @param {function(err, data)} callback 
 */
const getAllApplicationsDetails = (callback) => {
    var applicationList = {};
    const seriesTasks = {
        task1_getAllApplications: (asyncCallback) => {
            let query = {
                deleted: false
            };
            let projection = {
                __v: 0,
                deleted: false
            };

            Services.applicationServices.getAllApplicationsDetails(
                query, projection, {}, (err, data) => {
                    if (err) {
                        asyncCallback(err);
                    } else {
                        if (null != data && data.length != 0) {
                            applicationList.applications = data;
                        }
                        asyncCallback();
                    }
                }
            );
        }
    }

    // Fetch all applications
    async.series(seriesTasks, (err) => {
        if (err) {
            callback(err);
        } else {
            callback(null, applicationList);
        }
    });
}

/**
 * Delete (soft-delete) a registered application.
 * Only admins and developers are allowed to delete a application.
 * All other users are rejected
 * 
 * @param {string} applicationId 
 * @param {object} credentials 
 * @param {function(err, data)} callback 
 */
const deleteApplicationDetails = (applicationId, credentials, callback) => {
    var deletedApplication = {};
    let query = {
        _id: applicationId,
        deleted: false
    };
    const seriesTasks = {
        task1_checkApplicationExists: (asyncCallback) => {
            let projection = {
                __v: 0
            };

            // Patients and Caregivers are not allowed to delete applications
            if (credentials.userRole == Constants.USER_ROLES.PATIENT
                || credentials.userRole == Constants.USER_ROLES.CAREGIVER) {
                asyncCallback(Boom.forbidden(Constants.MESSAGES.ACTION_NOT_PERMITTED));
            } else {
                Services.applicationServices.getApplicationDetails(
                    query, projection, {}, (err, data) => {
                        if (err) {
                            asyncCallback(err);
                        } else {
                            // Application not found
                            if (null == data) {
                                asyncCallback(Boom.notFound(`Application ${applicationId} does not exist`));
                            } else {
                                // Application found
                                asyncCallback();
                            }
                        }
                    }
                );
            }
        },
        task2_deleteApplication: (asyncCallback) => {
            let updateData = {
                deleted: true
            }
            Services.applicationServices.updateApplicationDetails(query, updateData,
                { upsert: false }, (err, data) => {
                    if (err) {
                        asyncCallback(err);
                    } else {
                        deletedApplication._id = data._id;
                        asyncCallback();
                    }
                }
            );
        }
    }

    // Perform series tasks
    async.series(seriesTasks, (err) => {
        if (err) {
            callback(err);
        } else {
            callback(null, deletedApplication);
        }
    });
}

/**
 * Update details of a registered application.
 * Only admins and developers are allowed to update a application.
 * All other users are rejected
 * 
 * @param {string} applicationId 
 * @param {object} payload 
 * @param {object} credentials 
 * @param {function(err, data)} callback 
 */
const updateApplicationDetails = (applicationId, payload, credentials, callback) => {
    var updatedApplication = {};
    let query = {
        _id: applicationId,
        deleted: false
    };
    const seriesTasks = {
        task1_checkApplicationExists: (asyncCallback) => {
            let projection = {
                __v: 0
            };

            // Patients and Caregivers are not allowed to update applications
            if (credentials.userRole == Constants.USER_ROLES.PATIENT
                || credentials.userRole == Constants.USER_ROLES.CAREGIVER) {
                asyncCallback(Boom.forbidden(Constants.MESSAGES.ACTION_NOT_PERMITTED));
            } else {
                Services.applicationServices.getApplicationDetails(
                    query, projection, {}, (err, data) => {
                        if (err) {
                            asyncCallback(err);
                        } else {
                            //Application not found
                            if (null == data) {
                                asyncCallback(Boom.notFound(`Application ${applicationId} does not exist`));
                            } else {
                                // Application found
                                asyncCallback();
                            }
                        }
                    }
                );
            }
        },
        task2_updateApplication: (asyncCallback) => {
            Services.applicationServices.updateApplicationDetails(query, payload,
                { upsert: false }, (err, data) => {
                    if (err) {
                        asyncCallback(err);
                    } else {
                        updatedApplication._id = data._id;
                        asyncCallback();
                    }
                }
            );
        }
    }

    // Perform series tasks
    async.series(seriesTasks, (err) => {
        if (err) {
            callback(err);
        } else {
            callback(null, updatedApplication);
        }
    });
}

/**
 * Create a new application.
 * Only admins and developers are allowed to create an application.
 * All other users are rejected
 * 
 * TODO: add admin approval for applications. 
 * Right now, developers and admins can register application
 * 
 * @param {object} payload 
 * @param {object} credentials 
 * @param {function(err, data)} callback 
 */
const createNewApplication = (payload, credentials, callback) => {
    let registeredApplication = {};
    let query = {
        applicationName: payload.applicationName,
        developerId: payload.developerId
    };
    var applicationExists = false;
    var applicationId;
    const seriesTasks = {
        task1_checkDeveloperExists: (asyncCallback) => {
            let devQuery = {
                _id: payload.developerId
            };
            let projection = {
                __v: 0
            };

            // Patients and caregivers are not allowed to create applications
            if (credentials.userRole == Constants.USER_ROLES.PATIENT
                || credentials.userRole == Constants.USER_ROLES.CAREGIVER) {
                asyncCallback(Boom.forbidden(Constants.MESSAGES.ACTION_NOT_PERMITTED));
            } else {
                Services.developerServices.getSingleDeveloper(devQuery, projection, {}, (err, data) => {
                    if (err) {
                        asyncCallback(err);
                    } else {
                        if (null != data && data._id && !data.deleted) {
                            asyncCallback();
                        } else {
                            asyncCallback(Boom.badRequest(`Invalid developer ID`));
                        }
                    }
                });
            }
        },
        task2_checkApplicationExists: (asyncCallback) => {
            let projection = {
                __v: 0
            }

            Services.applicationServices.getApplicationDetails(query, projection, {}, (err, data) => {
                if (err) {
                    asyncCallback(err);
                } else if (null != data && data._id) {
                    if (!data.deleted) {
                        asyncCallback(Boom.conflict(`Application ${payload.applicationName} already exists.`));
                    } else {
                        applicationExists = true; //soft-deleted application record found
                        asyncCallback();
                    }
                } else {
                    asyncCallback();
                }
            });
        },
        task3_registerApplication: (asyncCallback) => {
            payload.deleted = false;
            payload.applicationRegistrationDate = Moment().utc().valueOf();

            if (!applicationExists) {
                Services.applicationServices.createApplicationDetails(payload, (err, data) => {
                    if (err) {
                        asyncCallback(err);
                    } else {
                        registeredApplication = {
                            _id: data._id,
                            applicationName: data.applicationName
                        }
                        //Create application folder
                        if(data.id != null){
                            Utils.createFolder(Constants.APP_STORAGE.PATH, data.id);
                        }
                        asyncCallback();
                    }
                });
            } else {
                console.log(`${Moment()} Application exists. Restoring and updating details.`)
                Services.applicationServices.updateApplicationDetails(query, payload,
                    { upsert: false }, (err, data) => {
                        if (err) {
                            asyncCallback(err);
                        } else {
                            registeredApplication = {
                                _id: data._id,
                                applicationName: data.applicationName
                            }
                            asyncCallback();
                        }
                    }
                );
            }
        }
    }

    // Perform async operations
    async.series(seriesTasks, (err) => {
        if (err) {
            callback(err);
        } else {
            callback(null, registeredApplication);
        }
    })
}

module.exports = {
    getSingleApplicationDetails: getSingleApplicationDetails,
    getAllApplicationsDetails: getAllApplicationsDetails,
    deleteApplicationDetails: deleteApplicationDetails,
    updateApplicationDetails: updateApplicationDetails,
    createNewApplication: createNewApplication
}