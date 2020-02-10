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
const Routes = require('./src/v1/routes');
const config = require('./src/v1/config');

// Create server instance
const serverInit = async () => {
    var server = Hapi.server({
        app: {
            name: config.CONSTANTS.SERVER.SERVICE_NAME
        },
        port: config.CONSTANTS.SERVER.PORT,
        host: 'localhost'
    });

    // Register plugins
    await server.register([
        Inert,
        Vision,
        {
            'plugin': HapiSwagger,
            'options': config.CONSTANTS.SWAGGER_OPTIONS
        }]
    );

    // Default route
    server.route({
        method: 'GET',
        path: '/',
        handler: (request, h) => {

            // Redirect request to swagger
            return h.redirect('/docs');
        }
    });

    server.validator(Joi);

    // Register routes in ./src/v1/routes
    server.route(Routes);

    // Logs registered with server will emit the event 'log'
    // and those with request will emit 'request
    server.events.on('log', (event, tags) => {
        if (tags.info) {
            console.log(event);
        }
    });

    server.events.on('request', (event, tags) => {
        if (tags.error) {
            console.log(event.info.message);
        }
    });

    await server.start(() => {
        console.log('info', `Started DEL service on : ${server.info.uri}:${config.CONSTANTS.SERVER.PORT}`);
    });
};

process.on('unhandledRejection', (err) => {
    console.log(`Error : ${err}`);
    process.exit(1);
});

serverInit();