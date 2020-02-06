/**
 * Services model describing available DEL applications
 * 
 * @author Ben Philip
 */

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

const serviceSchema = new Schema({
    serviceId: String,
    developerId: String,
    serviceDescription: String,
    serviceUrl: String,
    serviceIconUrl: String,
    dataDescription: {
        dataCollected: [
            {
                dataType: String,
                description: String
            }
        ]
    }
});

// Compile schema
const serviceModel = new Schema('SERVICE', serviceSchema, 'services');

module.exports = serviceModel;