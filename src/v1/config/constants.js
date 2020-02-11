/**
 * DEL service constants
 * 
 * @author Ben Philip
 */

const Dotenv = require('dotenv');

Dotenv.config();
/**
 * Server details
 */
const SERVER = {
    SERVICE_NAME: 'del-api',
    PORT: process.env.PORT || 3000,
    HOST: process.env.HOST || 'localhost'
}

const JWT_SECRETS = {
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
    JWT_ALGORITHM: process.env.JWT_ALGORITHM,
    JWT_DEFAULT_EXPIRY: process.env.JWT_DEFAULT_EXPIRY
}

const AUTH_CONFIG = {
    AUTH_STRATEGY: process.env.AUTH_STRATEGY || 'jwt_auth'
}

/**
 * Swagger options
 */
const SWAGGER_OPTIONS = {
    info: {
        'title': 'DEL API Documentation',
        'version': '0.0.1'
    },
    documentationPath: '/docs',
    grouping: 'tags'
}

/**
 * Status codes and default messages
 */
const HTTP_STATUS = {
    SUCCESS: {
        OK: {
            statusCode: 200,
            defaultMessage: "Successful"
        },
        CREATED: {
            statusCode: 201,
            defaultMessage: "Created"
        }
    },
    CLIENT_ERROR: {
        BAD_REQUEST: {
            statusCode: 400,
            defaultMessage: "Bad request"
        },
        UNAUTHORIZED: {
            statusCode: 401,
            defaultMessage: "Unauthorized"
        },
        FORBIDDEN: {
            statusCode: 403,
            defaultMessage: "Forbidden"
        },
        NOT_FOUND: {
            statusCode: 404,
            defaultMessage: "Not found"
        },
        CONFLICT: {
            statusCode: 409,
            defaultMessage: "Conflict"
        }
    },
    SERVER_ERROR: {
        INTERNAL_SERVER_ERROR: {
            statusCode: 500,
            defaultMessage: "Internal Server Error"
        }
    }
}

/**
 * User roles
 */
const USER_ROLES = {
    ADMIN: "admin",
    PATIENT: "patient",
    CAREGIVER: "caregiver"
}

const CONSTANTS = {
    SERVER: SERVER,
    JWT_SECRETS: JWT_SECRETS,
    AUTH_CONFIG: AUTH_CONFIG,
    SWAGGER_OPTIONS: SWAGGER_OPTIONS,
    HTTP_STATUS: HTTP_STATUS,
    USER_ROLES: USER_ROLES
}

module.exports = CONSTANTS;