/**
 * 
 * @author Ben Philip
 */

 'use strict';

 const userRoutes = require('./userRoutes');
 const authRoutes = require('./authRoutes');

 var apiRoutes = [].concat(userRoutes, authRoutes);

 module.exports = apiRoutes;