/**
 * API routes
 * 
 * @author Ben Philip
 */

'use strict';

const userRoutes = require('./userRoutes');
const authRoutes = require('./authRoutes');
const applicationRoutes = require('./applicationRoutes');
const userApplicationRoutes = require('./userApplicationRoutes');

var apiRoutes = [].concat(
    userRoutes,
    authRoutes,
    applicationRoutes,
    userApplicationRoutes
);

module.exports = apiRoutes;