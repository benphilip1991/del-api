/**
 * Database configuration
 *
 * @author Ben Philip
 */
'use strict';

const Mongoose = require('mongoose');

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

// Export config data just in case one needs the info elsewhere
module.exports = {
    dbInfo: database
}