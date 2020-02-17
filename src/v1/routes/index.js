/**
 * 
 * @author Ben Philip
 */

 'use strict';

 const userRoutes = require('./userRoutes');
 const authRoutes = require('./authRoutes');
 const applicationRoutes = require('./applicationRoutes');

 var apiRoutes = [].concat(userRoutes, authRoutes, applicationRoutes);

 module.exports = apiRoutes;