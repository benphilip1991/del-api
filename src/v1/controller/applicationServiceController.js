/**
 * Application services controller for managing
 * applications that will be linked to user profiles
 * and run on the mobile container.
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
 * Get details for a given application.
 * Only registered platform users are permitted to fetch
 * app details. Unregistered users are filtered off at the
 * route filter.
 * 
 * @param {string} serviceId  
 * @param {function(err, data)} callback 
 */
const getSingleApplicationDetails = (serviceId, callback) => {
    var service = {};
    const seriesTasks = {
        task1_getSingleServiceDetails: (asyncCallback) => {
            let query = {
                _id: serviceId,
                deleted: false
            };
            let projection = {
                __v: 0,
                deleted: 0
            };

            // Unauthorized users already blocked at the route filter
            Services.applicationServices.getServiceDetails(query, projection, {}, (err, data) => {
                if (err) {
                    asyncCallback(err);
                } else {
                    if (null != data) {
                        service = data;
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
            callback(null, service);
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
    var serviceList = {};
    const seriesTasks = {
        task1_getAllServices: (asyncCallback) => {
            let query = {
                deleted: false
            };
            let projection = {
                __v: 0,
                deleted: false
            };

            Services.applicationServices.getAllServicesDetails(
                query, projection, {}, (err, data) => {
                    if (err) {
                        asyncCallback(err);
                    } else {
                        if (null != data && data.length != 0) {
                            serviceList.services = data;
                        }
                        asyncCallback();
                    }
                }
            );
        }
    }

    // Fetch all services
    async.series(seriesTasks, (err) => {
        if (err) {
            callback(err);
        } else {
            callback(null, serviceList);
        }
    });
}

/**
 * Delete (soft-delete) a registered service.
 * Only admins and developers are allowed to delete a service.
 * All other users are rejected
 * 
 * @param {string} serviceId 
 * @param {object} credentials 
 * @param {function(err, data)} callback 
 */
const deleteServiceDetails = (serviceId, credentials, callback) => {
    var deletedService = {};
    let query = {
        _id: serviceId,
        deleted: false
    };
    const seriesTasks = {
        task1_checkServiceExists: (asyncCallback) => {
            let projection = {
                __v: 0
            };

            // Patients and Caregivers are not allowed to delete services
            if (credentials.userRole == Constants.USER_ROLES.PATIENT
                || credentials.userRole == Constants.USER_ROLES.CAREGIVER) {
                asyncCallback(Boom.forbidden(Constants.MESSAGES.ACTION_NOT_PERMITTED));
            } else {
                Services.applicationServices.getServiceDetails(
                    query, projection, {}, (err, data) => {
                        if (err) {
                            asyncCallback(err);
                        } else {
                            //Service not found
                            if (null == data) {
                                asyncCallback(Boom.notFound(`Service ${serviceId} does not exist`));
                            } else {
                                // Service found
                                asyncCallback();
                            }
                        }
                    }
                );
            }
        },
        task2_deleteService: (asyncCallback) => {
            let updateData = {
                deleted: true
            }
            Services.applicationServices.updateServiceDetails(query, updateData,
                { upsert: false }, (err, data) => {
                    if (err) {
                        asyncCallback(err);
                    } else {
                        deletedService._id = data._id;
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
            callback(null, deletedService);
        }
    });
}

/**
 * Update details of a registered service.
 * Only admins and developers are allowed to update a service.
 * All other users are rejected
 * 
 * @param {string} serviceId 
 * @param {object} payload 
 * @param {object} credentials 
 * @param {function(err, data)} callback 
 */
const updateServiceDetails = (serviceId, payload, credentials, callback) => {
    var updatedService = {};
    let query = {
        _id: serviceId,
        deleted: false
    };
    const seriesTasks = {
        task1_checkServiceExists: (asyncCallback) => {
            let projection = {
                __v: 0
            };

            // Patients and Caregivers are not allowed to update services
            if (credentials.userRole == Constants.USER_ROLES.PATIENT
                || credentials.userRole == Constants.USER_ROLES.CAREGIVER) {
                asyncCallback(Boom.forbidden(Constants.MESSAGES.ACTION_NOT_PERMITTED));
            } else {
                Services.applicationServices.getServiceDetails(
                    query, projection, {}, (err, data) => {
                        if (err) {
                            asyncCallback(err);
                        } else {
                            //Service not found
                            if (null == data) {
                                asyncCallback(Boom.notFound(`Service ${serviceId} does not exist`));
                            } else {
                                // Service found
                                asyncCallback();
                            }
                        }
                    }
                );
            }
        },
        task2_updateService: (asyncCallback) => {
            Services.applicationServices.updateServiceDetails(query, payload,
                { upsert: false }, (err, data) => {
                    if (err) {
                        asyncCallback(err);
                    } else {
                        updatedService._id = data._id;
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
            callback(null, updatedService);
        }
    });
}

/**
 * Create a new application service.
 * Update details of a registered service.
 * Only admins and developers are allowed to create a service.
 * All other users are rejected
 * 
 * TODO: add admin approval for services. 
 * Right now, developers and admins can register services
 * 
 * @param {object} payload 
 * @param {object} credentials 
 * @param {function(err, data)} callback 
 */
const createNewApplicationService = (payload, credentials, callback) => {
    let registeredService = {};
    let query = {
        serviceName: payload.serviceName,
        developerId: payload.developerId
    };
    var serviceExists = false;
    const seriesTasks = {
        task1_checkDeveloperExists: (asyncCallback) => {
            let devQuery = {
                _id: payload.developerId
            };
            let projection = {
                __v: 0
            };

            // Patients and caregivers are not allowed to create services
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
        task2_checkServiceExists: (asyncCallback) => {
            let projection = {
                __v: 0
            }

            Services.applicationServices.getServiceDetails(query, projection, {}, (err, data) => {
                if (err) {
                    asyncCallback(err);
                } else if (null != data && data._id) {
                    if (!data.deleted) {
                        asyncCallback(Boom.conflict(`Service ${payload.serviceName} already exists.`));
                    } else {
                        serviceExists = true; //soft-deleted service record found
                        asyncCallback();
                    }
                } else {
                    asyncCallback();
                }
            });
        },
        task3_registerService: (asyncCallback) => {
            payload.deleted = false;
            payload.serviceRegistrationDate = Moment().utc().valueOf();

            if (!serviceExists) {
                Services.applicationServices.createServiceDetails(payload, (err, data) => {
                    if (err) {
                        asyncCallback(err);
                    } else {
                        registeredService = {
                            _id: data._id,
                            serviceName: data.serviceName
                        }
                        asyncCallback();
                    }
                });
            } else {
                console.log(`${Moment()} Service exists. Restoring service and updating details.`)
                Services.applicationServices.updateServiceDetails(query, payload,
                    { upsert: false }, (err, data) => {
                        if (err) {
                            asyncCallback(err);
                        } else {
                            registeredService = {
                                _id: data._id,
                                serviceName: data.serviceName
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
            callback(null, registeredService);
        }
    })
}

module.exports = {
    getSingleApplicationDetails: getSingleApplicationDetails,
    getAllApplicationsDetails: getAllApplicationsDetails,
    deleteServiceDetails: deleteServiceDetails,
    updateServiceDetails: updateServiceDetails,
    createNewApplicationService: createNewApplicationService
}