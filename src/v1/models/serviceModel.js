/**
 * Services model describing available DEL applications
 * 
 * @author Ben Philip
 */

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

const serviceSchema = new Schema({
    serviceId: { type: String, required: true },
    developerId: { type: String, required: true },
    serviceDescription: { type: String, required: true },
    serviceUrl: { type: String, required: true },
    serviceIconUrl: { type: String, required: true },
    dataDescription: {
        dataCollected: [
            {
                dataType: { type: String, required: true },
                description: { type: String, required: true }
            }
        ]
    }
});

// Compile schema
const serviceModel = Mongoose.model('SERVICE', serviceSchema, 'services');

module.exports = serviceModel;