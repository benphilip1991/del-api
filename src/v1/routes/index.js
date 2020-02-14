/**
 * 
 * @author Ben Philip
 */

 'use strict';

 const userRoutes = require('./userRoutes');
 const authRoutes = require('./authRoutes');
 const appServiceRoutes = require('./applicationServiceRoutes');

 var apiRoutes = [].concat(userRoutes, authRoutes, appServiceRoutes);

 module.exports = apiRoutes;