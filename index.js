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
const Botkit = require('botkit');

const botOptions = {
    replyWithTyping: false
};

// Use a mongo database if specified, otherwise store in a JSON file local to the app.
// Mongo is automatically configured when deploying to Heroku
if (process.env.MONGO_URI) {
    // create a custom db access method
    var db = require(__dirname + '/components/database.js')({});
    botOptions.storage = db;
  } else {
      botOptions.json_file_store = __dirname + '/.data/db/'; // store user data in a simple JSON format
  }

// Create server instance
const serverInit = async () => {
    var server = Hapi.server({
        app: {
            name: config.CONSTANTS.SERVER.SERVICE_NAME
        },
        port: config.CONSTANTS.SERVER.PORT,
        host: config.CONSTANTS.SERVER.HOST
    });

    var listener = server.listener;

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

    // Create the Botkit controller, which controls all instances of the bot.
    var botkitController = Botkit.socketbot(botOptions);
    var normalizedPath = require("path").join(__dirname, "./src/v1/skills");
    require("fs").readdirSync(normalizedPath).forEach(function(file) {
        require("./src/v1/skills/" + file)(botkitController);
    });
    console.log('Chatbot is online on port: ' + (process.env.PORT || 3000))

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

    botkitController.openSocketServer(listener); //open websocket server.
    botkitController.startTicking();
    
    await server.start(() => {
        console.log('info', `Started DEL service on : ${server.info.uri}`);
    });
};

process.on('unhandledRejection', (err) => {
    console.log(`Error : ${err}`);
    process.exit(1);
});

serverInit();