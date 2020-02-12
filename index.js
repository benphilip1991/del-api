/**
 * DEL service backend APIs entry
 * 
 * @author Ben Philip
 */

'use strict'

const Hapi = require('@hapi/hapi');
const HapiSwagger = require('hapi-swagger');
const Inert = require('@hapi/inert');
const Vision = require('@hapi/vision');
const Joi = require('@hapi/joi');
const AuthToken = require('hapi-auth-bearer-token');
const Routes = require('./src/v1/routes');
const config = require('./src/v1/config');
const AuthUtils = require('./src/v1/utils/authUtils');

// Create server instance
const serverInit = async () => {
    var server = Hapi.server({
        app: {
            name: config.CONSTANTS.SERVER.SERVICE_NAME
        },
        port: config.CONSTANTS.SERVER.PORT,
        host: config.CONSTANTS.SERVER.HOST
    });

    // Register plugins
    await server.register([
        AuthToken,
        Inert,
        Vision,
        {
            'plugin': HapiSwagger,
            'options': config.CONSTANTS.SWAGGER_OPTIONS
        }]
    );

    // Registering auth strategy
    server.auth.strategy(config.CONSTANTS.AUTH_CONFIG.AUTH_STRATEGY, 'bearer-access-token', {
        allowMultipleHeaders: false,
        tokenType: 'Bearer',
        validate: async (request, token, h) => {
            let isValid = false;
            var credentials = {},
            credentials = AuthUtils.verifyToken(token);
            if (credentials && credentials.userId) {
                isValid = true;
            }
            return { isValid, credentials };
        }
    });

    // Register validator
    server.validator(Joi);

    // Default route
    server.route({
        method: 'GET',
        path: '/',
        handler: (request, h) => {

            // Redirect request to swagger
            return h.redirect('/docs');
        }
    });

    // Register routes in ./src/v1/routes
    server.route(Routes);

    console.log(`Starting DEL service on : ${server.info.uri}`);
    await server.start(() => {
        console.log('info', `Started DEL service on : ${server.info.uri}`);
    });
};

process.on('unhandledRejection', (err) => {
    console.log(`Error : ${err}`);
    process.exit(1);
});

serverInit();