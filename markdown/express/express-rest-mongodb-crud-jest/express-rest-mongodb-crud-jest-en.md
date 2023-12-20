#   Create Integration Test For CRUD Operations With Expressjs, Mongodb And JEST

Postingan ini lanjutan dari postingan [Building CRUD Application With Expressjs and Mongodb](https://marmeam.com/post/express-rest-mongodb-crud). Pada postingan ini akan menunjukkan cara membuat integration test dengan menggunakan JEST.

##  Requirement

1.  [Node](https://nodejs.org/en)
1.  [Mongodb](https://www.mongodb.com/)
1.  [Docker](https://www.docker.com/)
1.  [VisualStudioCode](https://code.visualstudio.com/)

##  Reference

1.  [Express](https://expressjs.com/en/starter/installing.html)
1.  [Express & MongoDB](https://www.mongodb.com/compatibility/express)
1.	[mongodb-memory-server](https://github.com/nodkz/mongodb-memory-server)
1.  [JEST](https://jestjs.io/docs/getting-started)
1.  [supertest](https://github.com/ladjs/supertest#readme)

##  Prepare Project

Copy source code from [https://github.com/ferrylinton/express-sample/tree/main/express-rest-mongo-crud](https://github.com/ferrylinton/express-sample/tree/main/express-rest-mongo-crud).


Go to source code folder and install libraries

```console
npm i express mongodb cross-env
npm i -D mongodb-memory-server@7.6.3 jest supertest
```

##  Add Variable For Testing

Modify ***src\configs\mongodb.js*** and change PORT value to this

```js
const MONGODB_PORT = process.env.NODE_ENV === 'test' ? "27018" : "27017";
```

For testing, mongoclient will open a connection on port **27018**

##  Setup ***<u>mongodb-memory-server</u>*** For Testing

Create ***test\libs\mongo-test-util.js***, and add the following code.

```js
const { MongoMemoryServer } = require('mongodb-memory-server');
const { getMongoClient } = require('../../src/configs/mongodb');

// Create an MongoMemoryServer Instance
const mongoServer = new MongoMemoryServer({
	instance: {
		port: 27018
	},
	auth: {
		enable: true,
		extraUsers: [{
			createUser: "admin",
			pwd: "password",
			roles: [{
				role: "root",
				db: "admin"
			}],
			database: "admin"
		}]
	}
});

// Start the MongoMemoryServer
exports.startMongoServer = async () => {
	try {
		await mongoServer.start(true);
		console.log(`mongoServer starting on ${mongoServer.getUri()}`);
	} catch (error) {
		console.log(error);
	}
};

// Stop the current MongoMemoryServer
exports.stopMongoServer = async () => {
	try {
		const connection = await getMongoClient();
		if (connection) {
			// Close the client and its underlying connections
			connection.close();
		}

		await mongoServer.stop();
	} catch (error) {
		console.log(error);
	}
};
```

Description: 

-   **instance**:

    -   **port: 27018**
        
        MongoMemoryServer will start on port 27018

-   **auth**:

    -   **enable: true**

        Enable user creation on MongoMemoryServer

    -   **extraUsers: [{
			createUser: "admin",
			pwd: "password",
			roles: [{
				role: "root",
				db: "admin"
			}],
			database: "admin"
		}]**

        Add new user to **admin** database.

##  Add Integration Test

Add ***test\routers\todo-router.test.js*** file and add the following code.

```js
const assert = require('assert');
const request = require('supertest');
const app = require('../../src/app');
const { startMongoServer, stopMongoServer } = require('../libs/mongo-test-util');

beforeAll(async () => {
    await startMongoServer();
});

afterAll(async () => {
    await stopMongoServer();
});

describe('/api/todoes', () => {

    let _id = '0';

    describe('POST /api/todoes', function () {

        it('should create a task', async function () {
            const response = await request(app)
                .post('/api/todoes') 
                .send({ task: 'test' })
                .set('Accept', 'application/json')
                .expect(201); 

            _id = response.body.insertedId;
            assert(response.body.acknowledged, true);
        });

    });

    describe('GET /api/todoes/:_id', function () {

        it('should return a task', async function () {
            const response = await request(app)
                .get('/api/todoes/' + _id)
                .set('Accept', 'application/json')
                .expect(200);
            assert(response.body._id, _id);
        });

    });

    describe('GET /api/todoes/', function () {

        it('should return list of tasks', async function () {
            const response = await request(app)
                .get(`/api/todoes`)
                .set('Accept', 'application/json')
                .expect(200);
            assert(response.body.length, 1);
        });

    });

    describe('PUT /api/todoes/:_id', function () {

        it('should update task', async function () {
            const response = await request(app)
                .put('/api/todoes/' + _id)
                .send({ task: 'test update' })
                .set('Accept', 'application/json')
                .expect(200);
            assert(response.body.modifiedCount, 1);
        });

    });

    describe('DELETE /api/todoes/:_id', function () {

        it('should update task', async function () {
            const response = await request(app)
                .delete('/api/todoes/' + _id)
                .set('Accept', 'application/json')
                .expect(200);
            assert(response.body.deletedCount, 1);
        });

    });

    describe('GET /api/todoes/:_id', function () {

        it('should return 404', async function () {
            await request(app)
                .get('/api/todoes/' + _id)
                .set('Accept', 'application/json')
                .expect(404);
        });

    });

})
```

##  Add Script For Testing

Modify ***package.jsons*** and add this script

```json
"test": "cross-env NODE_ENV=test jest --runInBand --detectOpenHandles --forceExit"
```
Description :

1.  **cross-env NODE_ENV=test** : add variabel process.env.NODE_ENV = 'test'

1.  **jest** : execute the testing process
    -  **--forceExit** : force Jest to exit after all tests have completed running
    -  **--runInBand** : run all tests serially in the current process
    -  **--detectOpenHandles** : attempt to collect and print open handles preventing Jest from exiting cleanly

##  Run Integration Test

```console
npm test
```

Result :

![express-rest-mongodb-crud-jest-01.png](express-rest-mongodb-crud-jest-01.png)

##  Source Code

::: github
[https://github.com/ferrylinton/nodejs-sample/tree/main/express-rest-mongodb-crud-jest](https://github.com/ferrylinton/nodejs-sample/tree/main/express-rest-mongodb-crud-jest)
:::

::: post-navigation
[Building CRUD Application With Expressjs and Mongodb](/post/express-rest-mongodb-crud "previous")
:::