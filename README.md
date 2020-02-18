# del-api
Digital Enhanced Living service management APIs  
_This service is still under development and features are constantly being added. Additions may break existing functionality. Please refer to the development branch for the latest changes._

## Table of Contents
1. [About](#about)
2. [Installation and Running](#installation-and-running)
3. [Environmental Variables](#environmental-variables)

## About
The Digital Enhanced Living (DEL) api (del-api) service is the management module for the DEL platform and handles user profiles, application details and tracks linked services and user activities on the container application. The service will be expanded to add more features including health metric tracking and mHealth profiles for remote health management by caregivers.  
Other services contributing to the platform include [__del-auth__](https://github.com/benphilip1991/del-auth), [__del-web__](https://github.com/benphilip1991/del-web) and [__del-container__](https://github.com/benphilip1991/del-container). More details can be found on their respective pages.  
_Please note that the repositories may be private at the moment and will be made public as they are developed._

## Installation and Running
The service is built using JavaScript (NodeJS) and uses MongoDb for storage. For testing, please ensure both are installed.  
To install dependencies, execute the following from the cloned directory: 
```bash 
$ npm install
```  
The following script will start the mongo daemon if not already running:
```bash
$ ./start_mongo.sh
```  
Once the setup is complete, the service can be launched (in dev mode) using:
```bash
$ npm run dev_local
```
Once running, the api documentation can be viewed through the SwaggerUI at `{host}:{port}/docs`  

## Environmental Variables
The del-api service requires several environmental variables to define runtime settings as well as parameters for default service profiles. These can be exported to the bash environment OR stored in a `.env` file as key-value pairs such as: 
```
PORT=3000
JWT_ALGORITHM="HS256"
```
The service will recognise the file and read on launch.  

__Host parameters__
|Key                       | Description                   | Default Value             |
|--------------------------|-------------------------------|---------------------------|
|`HOST`                    |Application hostname           |`localhost`|
|`PORT`                    |Application port number        |`3000`|

__Authentication parameters__
|Key                       | Description                   | Default Value             |
|--------------------------|-------------------------------|---------------------------|
|`JWT_SECRET_KEY`          |The secret key used in the token generation/verification algorithm| `none`|
|`JWT_ALGORITHM`           |The algorithm used for generating and verifying tokens | `HS256` |
|`JWT_DEFAULT_EXPIRY`      |The default validity duration for a token. Valid values include strings such as "1d", "60s", "1m" "1h" for 1 day, 60 seconds, 1 minute or 1 hour| `1d`
|`AUTH_STRATEGY`           |Authentication strategy name used to refer to the mechanism from plugin registration to routes| `jwt_auth` |

__Default superuser profile__  
|Key                       | Description                   | Default Value             |
|--------------------------|-------------------------------|---------------------------|
|`SU_FIRSTNAME`            |Superuser first name |`admin`|
|`SU_LASTNAME`             |Superuser last name|`admin`|
|`SU_EMAILID`              |Superuser email id (_this will be the default admin login credential_)|`admin@mail.com`|
|`SU_AGE`                  |Superuser age (_doesn't matter for the superuser and can be any number_)|`40`|
|`SU_SEX`                  |Superuser gender (_doesn't matter for the superuser_) | `Male`|
|`SU_PASSWORD`             |Superuser password |`@dminpassword!`|
|`SU_USERROLE`             |Superuser role |`admin`|

__Default developer profile__  
_This profile describes the default publisher of health services_  
|Key                       | Description                   | Default Value             |
|--------------------------|-------------------------------|---------------------------|
|`DEV_NAME`                |Default developer name. Jsut like the superuser, this profile cannot be deleted.| `del_developer`|


__More details to come soon!__