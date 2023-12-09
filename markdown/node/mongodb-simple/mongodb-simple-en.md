#   Simple Example of Mongodb With NodeJS

This post shows how to setup a node application that uses the MongoDB Node.js driver to connect to a MongoDB. Add code to connect to a MongoDB and create a function to query data.

##  Requirement

1.	[Node](https://nodejs.org/en)
1.	[Mongodb](https://www.mongodb.com/)
1.	[Docker](https://www.docker.com/)
1.	[Visual Studio Code](https://code.visualstudio.com/)

##  Reference

1.  [NodeJS](https://nodejs.org/api/modules.html)
1.	[MongoDB Node Driver](https://www.mongodb.com/docs/drivers/node/current/)
1.  [dotenv](https://github.com/motdotla/dotenv#readme)

## 	Setup MongoDB with Docker

1.  Start MongoDB in a Docker Container with this script (you can skip this if you already have mongodb installed)

    ```console
    docker run --name local-mongo -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=admin -e MONGO_INITDB_ROOT_PASSWORD=password -d mongo:5.0-focal
    ```

    Mongodb configuration:
    -  host : **127.0.0.1**
    -  port: **27017**
    -  username: **admin**
    -  password: **password**

##  Create Node Application

See these posts:

-	[Setup Node Application With Eslint (Common JS)](https://marmeam.com/post/eslint-commonjs-setup)
-	[Setup Node Application With Eslint And Prettier (Common JS)](https://marmeam.com/post/eslint-prettier-commonjs-setup)
-	[Simple Example of JEST](https://marmeam.com/post/jest-simple)
-	[Setup Multiple **.env** Files For Development, Testing And Production](https://marmeam.com/post/multi-env-files)

##  Install Libraries

```console
npm i mongodb dotenv cross-env
```

## 	Setup Environment Variables


1.	Create ***.env.development*** file, and add the following configuration 

	```
	# MONGODB
	MONGODB_HOST=127.0.0.1
	MONGODB_PORT=27017
	MONGODB_AUTH_SOURCE=admin
	MONGODB_USERNAME=admin
	MONGODB_PASSWORD=password
	MONGODB_DATABASE=blogdb
	```

1.	Create ***.env.production*** file, and add the following configuration 

	```
	# MONGODB
	MONGODB_HOST=127.0.0.1
	MONGODB_PORT=27017
	MONGODB_AUTH_SOURCE=admin
	MONGODB_USERNAME=admin
	MONGODB_PASSWORD=password
	MONGODB_DATABASE=blogdb
	```

1.  Add ***src\configs\env-constant.js*** file, and add the following code.

    ```js
    const fs = require('fs');
    const path = require('path');

    /**
    * Creates a file name based on the NODE_ENV value
    * 1. NODE_ENV=production => .env.production
    * 2. NODE_ENV=development => .env.development
    * 3. NODE_ENV=test => .env.test
    */
    const envFile = path.resolve(process.cwd(), `.env.${process.env.NODE_ENV || ''}`)

    // throw error if envFile is not found
    if (!fs.existsSync(envFile)) {
        throw new Error(`${envFile} is not found`);
    }

    // loads environment variables
    require('dotenv').config({
        path: envFile
    });

    module.exports = {
        MONGODB_HOST: process.env.MONGODB_HOST || '127.0.0.1',
		MONGODB_PORT: process.env.MONGODB_PORT || '27017',
		MONGODB_AUTH_SOURCE: process.env.MONGODB_AUTH_SOURCE,
		MONGODB_USERNAME: process.env.MONGODB_USERNAME,
		MONGODB_PASSWORD: process.env.MONGODB_PASSWORD,
		MONGODB_DATABASE: process.env.MONGODB_DATABASE,
    }
    ```

##	Connect to MongoDB

Add ***mongodb-crud\src\configs\mongodb.js*** and add the following code,

```js
const { MongoClient } = require('mongodb');
const { MONGODB_AUTH_SOURCE, MONGODB_DATABASE, MONGODB_PASSWORD, MONGODB_HOST, MONGODB_PORT, MONGODB_USERNAME } = require('./env-constant');

let mongoClient;

const getMongoClientInstance = () => {

	// MongoDB connection and authentication options.
	// Check this https://www.mongodb.com/docs/drivers/node/current/fundamentals/connection/connection-options/
    const mongoClientOptions = {
        authMechanism: "DEFAULT",
        authSource: MONGODB_AUTH_SOURCE,
        monitorCommands: true,
        auth: {
            username: MONGODB_USERNAME,
            password: MONGODB_PASSWORD
        }
    };

	// Mongodb connection string includes the hostname or IP address and port of your deployment.
	// Check this https://www.mongodb.com/docs/drivers/node/current/quick-start/create-a-connection-string/
    const mongodbURL = `mongodb://${MONGODB_HOST}:${MONGODB_PORT}`;
    const instance = process.env.NODE_ENV === 'test' ? new MongoClient(mongodbURL) : new MongoClient(mongodbURL, mongoClientOptions);
    
	// Record connection pool events in application.
	// Check this https://www.mongodb.com/docs/drivers/node/current/fundamentals/monitoring/connection-monitoring/
    instance.on('connectionPoolCreated', (event) => console.log(`[MONGODB] ${JSON.stringify(event)}`));
    instance.on('connectionPoolReady', (event) => console.log(`[MONGODB] ${JSON.stringify(event)}`));
    instance.on('connectionCreated', (event) => console.log(`[MONGODB] ${JSON.stringify(event)}`));
    instance.on('connectionClosed', (event) => console.log(`[MONGODB] ${JSON.stringify(event)}`));

    return instance;
}

const getMongoClient = async () => {
    if (mongoClient === null || mongoClient === undefined) {
        try {
            mongoClient = getMongoClientInstance().connect();
        } catch (error) {
            mongoClient = null;
            console.log(error);
        }

        return mongoClient;
    }

    return mongoClient;
}

const getCollection = async (name) => {
    const connection = await getMongoClient();

    if (connection) {
        const db = connection.db(MONGODB_DATABASE);
        return db.collection(name);
    } else {
        throw new Error('No mongodb connection');
    }

}

module.exports = {
    getMongoClient,
    getCollection
};
```
##  Add Simple Code

1.  Add ***src\services\todo-service.js*** file, and add the following code.

    ```js
    const { getCollection } = require('../configs/mongodb');

    const TODO_COLLECTION = 'todo';

    const find = async () => {
        const todoCollection = await getCollection(TODO_COLLECTION);
        return todoCollection.find().toArray();
    };

    module.exports = {
        find,
    };
    ```

1.  Add ***src\index.js*** file, and add the following code.

    This file will be called to run the application.

    ```js
    const todoServcie = require('./services/todo-service');

    async function run() {
        const todoes = await todoServcie.find();
        console.log('>>> todoService.find()');
        console.log(todoes);
    }

    function close() {
        setTimeout(function () {
            process.exit();
        }, 1000);
    }

    run().catch(console.dir).finally(close);
    ```


1.  Modify ***package.json*** file, and add the following configuration.

    ```json
    {
        "name": "mongodb-simple",
        "version": "1.0.0",
        "description": "Simple Example of Mongodb With NodeJS",
        "main": " src/index.js",
        "scripts": {
            "start": "cross-env NODE_ENV=production node src/index.js",
            "dev": "cross-env NODE_ENV=development node src/index.js",
            "test": "cross-env NODE_ENV=test jest",
            "lint": "eslint .",
            "lint:fix": "eslint . --fix",
            "format": "prettier . --write",
            "format:check": "prettier . --check"
        },
        "keywords": [
            "node",
            "mongodb",
            "eslint"
        ],
        "author": "ferrylinton",
        "license": "ISC",
        "dependencies": {
            "cross-env": "^7.0.3",
            "dotenv": "^16.3.1",
            "mongodb": "^6.3.0"
        },
        "devDependencies": {
            "eslint": "^8.54.0",
            "eslint-config-prettier": "^9.0.0",
            "eslint-config-standard": "^17.1.0",
            "eslint-plugin-import": "^2.29.0",
            "eslint-plugin-jest": "^27.6.0",
            "eslint-plugin-n": "^16.3.1",
            "eslint-plugin-prettier": "^5.0.1",
            "eslint-plugin-promise": "^6.1.1",
            "jest": "^29.7.0",
            "prettier": "3.1.0"
        }
    }
    ```

1.  Run scripts.

    -   Run application on development mode.

        ```console
        npm run dev
        ```
        ![mongodb-simple-01.png](mongodb-simple-01.png)

    -   Run application on production mode.

        ```console
        npm start
        ```
        ![mongodb-simple-02.png](mongodb-simple-02.png)

## Source Code

https://github.com/ferrylinton/nodejs-sample/tree/main/mongodb-simple