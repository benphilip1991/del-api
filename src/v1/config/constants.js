/**
 * DEL service constants
 * 
 * @author Ben Philip
 */

/**
 * Server details
 */
const SERVER = {
    SERVICE_NAME: 'del-api',
    PORT: 3000
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
    SWAGGER_OPTIONS: SWAGGER_OPTIONS,
    HTTP_STATUS: HTTP_STATUS,
    USER_ROLES: USER_ROLES
}

module.exports = CONSTANTS;