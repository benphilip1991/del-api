/**
 * 
 * @author Ben Philip
 */

 'use strict';

 const userRoutes = require('./userRoutes');
 const authRoutes = require('./authRoutes');

 var apiRoutes = [].concat(userRoutes);

 module.exports = apiRoutes;