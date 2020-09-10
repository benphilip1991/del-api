/**
 * Services model describing available DEL applications
 * 
 * @author Ben Philip
 */

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

const applicationSchema = new Schema({
    developerId: { type: String, required: true },
    applicationName: {type: String, required: true},
    applicationDescription: { type: String, required: true },
    applicationUrl: { type: String, required: true },
    applicationIconUrl: { type: String, required: true },
    applicationRegistrationDate: { type: Date, required: true },
    dataDescription: {
        dataCollected: [
            {
                dataType: { type: String },
                description: { type: String }
            }
        ]
    },
    applicationPermissions: {
        accessPermissions: [ 
            { type: String }
        ] 
    },
    deleted: { type: Boolean, require: true }
});

// Compile schema
const applicationModel = Mongoose.model('APPLICATION', applicationSchema, 'applications');

module.exports = applicationModel;