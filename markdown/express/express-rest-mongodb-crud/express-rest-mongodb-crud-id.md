#   Membangun Aplikasi CRUD Dengan Expressjs Dan Mongodb

MongoDB dan Node.js bekerja dengan baik jika dikombinasikan di dalam  satu aplikasi. Postingan ini menunjukkan cara membuat aplikasi Node.js dan MongoDB.

## Persyaratan

1.  [Node](https://nodejs.org/en)
1.  [Mongodb](https://www.mongodb.com/)
1.  [Docker](https://www.docker.com/)
1.  [VisualStudioCode](https://code.visualstudio.com/)

##  Referensi

1.  [Express](https://expressjs.com/en/starter/installing.html)
1.  [Express & MongoDB](https://www.mongodb.com/compatibility/express)

## 	Siapkan MongoDB dengan Docker

1.  Mulai MongoDB di Docker Container dengan skrip ini (Anda dapat melewati ini jika Anda sudah menginstal mongodb)

    ```console
    docker run --name local-mongo -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=admin -e MONGO_INITDB_ROOT_PASSWORD=password -d mongo:5.0-focal
    ```

    Konfigurasi Mongodb:
    -  host : **127.0.0.1**
    -  port: **27017**
    -  username: **admin**
    -  password: **password**
    
##  Buat Aplikasi Node

```console
npm ini -y
```
##  Instal Librari

```console
npm i mongodb dotenv cross-env
```

##	Membuat Koneksi ke MongoDB

Buat ***src\configs\mongodb.js*** dan tambahkan kode berikut,

```js
const { MongoClient } = require('mongodb');

const MONGODB_AUTH_SOURCE = "admin";
const MONGODB_DATABASE = "admin";
const MONGODB_HOST = "127.0.0.1";
const MONGODB_PORT = "27017";
const MONGODB_USERNAME = "admin";
const MONGODB_PASSWORD = "password";

/**
 * Modul yang menyediakan koneksi mongodb
 * @author ferrylinton
 * @module Mongodb
 */

/** @typedef {import("mongodb").MongoClient} MongoClient */
/** @typedef {import("mongodb").MongoClientOptions} MongoClientOptions */
/** @typedef {import("mongodb").Collection} Collection */

/**
 * @type {Promise<MongoClient>}
 */
let mongoClient;

/**
 * Buat instansi dari MongoClient
 * @returns {MongoClient}
 */
const getMongoClientInstance = () => {

    /**
     * @constant {MongoClientOptions} mongoClientOptions - Opsi kueri untuk klien mongo
     * @see https://www.mongodb.com/docs/manual/reference/connection-string
     */
    const mongoClientOptions = {
        authMechanism: "DEFAULT",
        authSource: MONGODB_AUTH_SOURCE,
        monitorCommands: true,
        auth: {
            username: MONGODB_USERNAME,
            password: MONGODB_PASSWORD
        }
    };

    /**
     * @constant {string} mongodbURL
     */
    const mongodbURL = `mongodb://${MONGODB_HOST}:${MONGODB_PORT}`;

    /**
     * @constant {MongoClient} instance - Kelas MongoClient
     * @see https://www.mongodb.com/docs/drivers/node/current/quick-start/create-a-connection-string/
     */
    const instance = process.env.NODE_ENV === 'test' ? new MongoClient(mongodbURL) : new MongoClient(mongodbURL, mongoClientOptions);

    // Rekam even koneksi dalam aplikasi.
	// Lihat tautan https://www.mongodb.com/docs/drivers/node/current/fundamentals/monitoring/connection-monitoring/
    instance.on('connectionPoolCreated', (event) => console.log(`[MONGODB] ${JSON.stringify(event)}`));
    instance.on('connectionPoolReady', (event) => console.log(`[MONGODB] ${JSON.stringify(event)}`));
    instance.on('connectionCreated', (event) => console.log(`[MONGODB] ${JSON.stringify(event)}`));
    instance.on('connectionClosed', (event) => console.log(`[MONGODB] ${JSON.stringify(event)}`));

    return instance;
}

/**
 * Buat Promise dari MongoClient dari instan MongoClient
 * @returns {Promise<MongoClient>}
 */
exports.getMongoClient = async () => {
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

/**
 * Buat referensi ke koleksi MongoDB.
 * @param {string} name - Nama dari koleksi
 * @returns {Promise<Collection>}
 */
exports.getCollection = async (name) => {
    const connection = await this.getMongoClient();

    if (connection) {
        const db = connection.db(MONGODB_DATABASE);
        return db.collection(name);
    } else {
        throw new Error('No mongodb connection');
    }
}
```

##  Buat Kode untuk Operasi CRUD

### Tambahkan service untuk menangani operasi CRUD

Buat berkas ***src\services\todo-service.js*** dan tambahkan kode berikut

```js
const { ObjectId } = require('mongodb');
const { getCollection } = require('../configs/mongodb');

/**
 * A service that handles CRUD operations of Todo's data
 * @author ferrylinton
 * @module TodoService
 */

/** @typedef {import("mongodb").InsertOneResult} InsertOneResult */
/** @typedef {import("mongodb").UpdateResult} UpdateResult */
/** @typedef {import("mongodb").DeleteResult} DeleteResult */

/**
 * @typedef {Object} Todo
 * @property {string} _id - The Id
 * @property {string} task - The task
 * @property {boolean} done - The status of the task
 * @property {date} createdAt - Created date
 * @property {date|null} updatedAt - Updated date
 */

/**
 * @const {string} Name of Todo Collection
 */
const TODO_COLLECTION = 'todoes';

/**
 * Find multiple Todo documents
 *
 * @returns Array of {@link Todo} documetns.
 *
 */
exports.find = async () => {
	const todoCollection = await getCollection(TODO_COLLECTION);
	return todoCollection.find().toArray();
};

/**
 * Find a Todo document by ID
 *
 * @param {string} _id - The ID of todo document
 * @returns A {@link Todo} document
 */
exports.findById = async _id => {
	const todoCollection = await getCollection(TODO_COLLECTION);
	return await todoCollection.findOne({ _id: new ObjectId(_id) });
};

/**
 * Create a new Todo document.
 *
 * @param {string} task - The task
 * @returns Object of {@link InsertOneResult}
 */
exports.create = async task => {
	const todo = {
		task,
		done: false,
		createdAt: new Date(),
		updatedAt: null,
	};
	const todoCollection = await getCollection(TODO_COLLECTION);
	return await todoCollection.insertOne(todo);
};

/**
 * Update a todo document in a collection
 *
 * @param {string} _id - The ID of todo document
 * @param {Object} updateData - The new data
 * @param {string} updateData.task - The new task
 * @param {boolean} updateData.done - The task status
 * @returns Object of {@link UpdateResult}.
 */
exports.update = async (_id, { task, done }) => {
	const todoCollection = await getCollection(TODO_COLLECTION);
	const updatedAt = new Date();
	const todo = { updatedAt };
    
    if(task){
        todo.task = task
    }

    if(done !== null || done !== undefined){
        todo.done = done
    }

	return await todoCollection.updateOne({ _id: new ObjectId(_id) }, { $set: todo });
};

/**
 * Delete a todo document from a collection.
 *
 * @param {string} _id - The ID of todo document
 * @returns Object of {@link DeleteResult}.
 */
exports.deleteById = async _id => {
	const todoCollection = await getCollection(TODO_COLLECTION);
	return await todoCollection.deleteOne({ _id: new ObjectId(_id) });
};
```
### Tambahkan controller untuk menangani operasi CRUD

Buat berkas ***src\routers\todo-router.js*** dan tambahkan kode berikut

```js
const todoService = require('../services/todo-service');

/**
 * A controller that handles CRUD operations of Todo's data
 * @author ferrylinton
 * @module TodoController
 */

/**
 * Get list of todoes
 */
exports.find = async (req, res, next) => {
    try {
        const todoes = await todoService.find()
        res.status(200).json(todoes);
    } catch (error) {
        next(error);
    }
};

/**
 * Get todo by ID
 */
exports.findById = async (req, res, next) => {
    try {
        const todo = await todoService.findById(req.params._id);
        if (todo) {
            res.status(200).json(todo);
        } else {
            res.status(404).json({ message: "Data is not found" });
        }
    } catch (error) {
        next(error);
    }
};

/**
 * Create new todo
 */
exports.create = async (req, res, next) => {
    try {
        const todo = await todoService.create(req.body.task);
        res.status(201).json(todo);
    } catch (error) {
        next(error);
    }
};

/**
 * Update todo
 */
exports.update = async (req, res, next) => {
    try {
        const { task, done } = req.body;
        const updateResult = await todoService.update(req.params._id, { task, done });
        res.status(200).json(updateResult)
    } catch (error) {
        next(error);
    }
};

/**
 * Delete todo by ID
 */
exports.deleteById = async (req, res, next) => {
    try {
        const deleteResult = await todoService.deleteById(req.params._id);
        res.status(200).json(deleteResult)
    } catch (error) {
        next(error);
    }
};
```

### Tambahkan router untuk menangani operasi CRUD

Buat berkas ***src\routers\todo-router.js*** dan tambahkan kode berikut

```js
const express = require('express');
const todoController = require('../controllers/todo-controller');

const router = express.Router();

router.get('/', todoController.find);
router.post('/', todoController.create);
router.get("/:_id", todoController.findById);
router.put("/:_id", todoController.update);
router.delete("/:_id",todoController.deleteById);

module.exports = router;
```

### Buat **app.js**

Buat berkas ***src\app.js*** dan tambahkan kode berikut

```js
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const todoRouter = require('./routers/todo-router');

/**
 * Creates an Express application
 */
const app = express();

// helmet helps secure Express apps by setting HTTP response headers
app.use(helmet());

// enable CORS
app.use(cors({ origin: '*' }));

// parses incoming requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// map router to express application
app.use('/api/todoes', todoRouter);

// 404 / not found handler
app.use((req, res, next) => {
    res.status(404).json({ message: "Not Found" })
})

// error handler
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).json({ message: err.message })
})

module.exports = app;
```
### Add **server.js**

Create ***src\server.js*** and add the following code.

```js
const app = require('./app');

/**
 * @constant {number} express application running on this port number
 */
const PORT = 5001;

/**
 * This function is called after the Express application runs
 */
const callback = () => {
    console.log(`[SERVER] Server is running at 'http://127.0.0.1:${PORT}'`);
};

/**
 * This function is the first function to be executed to start Express application.
 */
const main = () => {
    try {
        // this code start express app
        app.listen(PORT, "0.0.0.0", callback);
    } catch (error) {
        //The application will stop if there is an error
        console.log(error);
        process.exit();
    }
};

// Execute main() function
main();
```
##  Run Application

Ubah berkas ***package.json*** dan tambahkan skrip berikut

```json
"dev": "node src/server.js"
```

Jalankan skrip berikut

```console
npm run dev
```

##  Tes TODO API (Operasi CRUD)

### Create - [POST] - http://127.0.0.1:5001/api/todoes

Request
```json
{
    "task": "Create node application"
}
```

Response
```json
{
    "acknowledged": true,
    "insertedId": "657967fdf090133c28ec908d"
}
 ```
### Find - [GET] - http://127.0.0.1:5001/api/todoes

Response
```json
[
    {
        "_id": "657967fdf090133c28ec908d",
        "task": "Create node application",
        "done": false,
        "createdAt": "2023-12-13T08:14:53.519Z",
        "updatedAt": null
    }
]
```

### FindByID - [GET] - http://127.0.0.1:5001/api/todoes/657967fdf090133c28ec908d

Response
```json
{
    "_id": "657967fdf090133c28ec908d",
    "task": "Create node application",
    "done": false,
    "createdAt": "2023-12-13T08:14:53.519Z",
    "updatedAt": null
}
```

### Update - [PUT] - http://127.0.0.1:5001/api/todoes/657967fdf090133c28ec908d

Request
```json
{
	"done": true
}
```
    
Response
```json
{
    "acknowledged": true,
    "modifiedCount": 1,
    "upsertedId": null,
    "upsertedCount": 0,
    "matchedCount": 1
}
```

### DeleteByID - [DELETE] - http://127.0.0.1:5001/api/todoes/657967fdf090133c28ec908d

Response
```json
{
    "acknowledged": true,
    "deletedCount": 1
}
```

## Kode

::: github
[https://github.com/ferrylinton/express-sample/tree/main/express-rest-mongo-crud](https://github.com/ferrylinton/express-sample/tree/main/express-rest-mongo-crud)
:::

::: post-navigation
[Buat Tes Integrasi Untuk Operasi CRUD Dengan Expressjs, Mongodb Dan JEST](/post/express-rest-mongodb-crud-jest "berikutnya")
[Buat Aplikasi REST Express Sederhana](/post/express-rest-simple "sebelumnya")
:::