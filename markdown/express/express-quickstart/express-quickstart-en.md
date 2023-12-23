#   A Brief Introduction to ExpressJS

ExpressJS is a minimal and flexible Node.js framework, to build Web application and REST API application.

##  Reference

1.  [ExpressJS](https://expressjs.com/)

##	Install

```console
npm install express --save
```

##	Hello World

```js
const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
```
##  express()

The express() function creates an ExpressJS instance.

```js
const express = require('express')
const app = express()
```
##  Routing

Routing refers to determining how an application responds to a client request to a particular endpoint, which is a URI (or path) and a specific HTTP request method (GET, POST, and so on).

##	Routing with `const app = express()`

-	GET method route

	```js
	app.get('/', (req, res) => {
		res.send('GET request to the homepage')
	})
	```

-	POST method route

	```js
	app.post('/', (req, res) => {
		res.send('POST request to the homepage')
	})
	```

### Routing with `const router = express.Router()`

Use the express.Router class to create modular, mountable route handlers. 

-	GET method route

	```js
	router.get('/', (req, res) => {
		res.send('GET request to the homepage')
	})
	```

-	POST method route

	```js
	router.post('/', (req, res) => {
		res.send('POST request to the homepage')
	})
	````

Add router to express application

```js
app.use('/', router)
```

##  Middleware

Middleware functions are functions that have access to the request object, the response object and the next middleware function. Middleware can make changes to the request and the response objects.

- 	Application-level middleware

    ```js
    app.use((req, res, next) => {
        // code ...
        next()
    })
    ```
- 	Router-level middleware

    ```js
    router.get('/', (req, res, next) => {
        // code ...
        next()
    }, (req, res, next) => {
        res.send('GET request to the homepage')
    })
    ```
- 	NotFound-handling middleware

	```js
	app.use((req, res, next) => {
		res.status(404).json({ message: "Not Found" })
	})
	```
- 	Error-handling middleware

    ```js
    app.use((err, req, res, next) => {
        console.error(err.stack)
        res.status(500).send('Something broke!')
    })
    ```
	
::: post-navigation
[Create Simple ExpressJS Rest App](/post/express-rest-simple "next")
:::