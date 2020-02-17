/**
 * Database configuration
 *
 * @author Ben Philip
 */
'use strict';

const Mongoose = require('mongoose');
const Moment = require('moment');
const Services = require('../services');

const Utils = require('../utils');

const database = {
    dbUri: process.env.DB_URI || 'mongodb://localhost/del',
    port: 27017
}

// Establish db connection
try {
    Mongoose.connect(database.dbUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

} catch (error) {
    console.log(`Error: ${error}`);
    process.exit(1); // No database connection. Terminate
}

// Create admin and developer profiles
const adminUser = {
    firstName: process.env.SU_FIRSTNAME,
    lastName: process.env.SU_LASTNAME,
    emailId: process.env.SU_EMAILID,
    password: Utils.DelUtils.encryptPassword(process.env.SU_PASSWORD),
    age: process.env.SU_AGE,
    sex: process.env.SU_SEX,
    userRole: process.env.SU_USERROLE,
    deleted: false,
    deletable: false,
    creationDate: Moment().utc().valueOf()
}

const devProfile = {
    devName: process.env.DEV_NAME
}

Services.userServices.getSingleUser({emailId: adminUser.emailId}, {}, {}, (err, data) => {
    if(err) {
        console.log(`Database error. Terminating app \n${err}\n`);
        process.exit(1);
    } else {
        if(null == data) {
            console.log('Creating admin.');
            Services.userServices.createNewUser(adminUser, (err, data) => {
                if(err) {
                    console.log(err)
                } else {
                    console.log('Admin created');
                }
            })
        }
    }
});

// Create default developer profile
Services.developerServices.getSingleDeveloper({devName: devProfile.devName}, {}, {}, (err, data) => {
    if(err) {
        console.log(`Database error. Terminating app \n${err}\n`);
        process.exit(1);
    } else {
        if(null == data) {
            console.log('Creating default developer.');
            Services.developerServices.createNewDeveloper(devProfile, (err, data) => {
                if(err) {
                    console.log(err)
                } else {
                    console.log('Default developer profile created');
                }
            })
        }
    } 
});

// Export config data just in case one needs the info elsewhere
module.exports = {
    dbInfo: database
}