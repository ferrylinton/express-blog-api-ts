#   Pengenalan Singkat ExpressJS

ExpressJS adalah framework Node.js yang sederhana dan fleksibel, untuk membangun aplikasi Web dan aplikasi REST API.

##  Referensi

1.  [ExpressJS](https://expressjs.com/)

##	Instal

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

Fungsi express() membuat instansi dari ExpressJS.

```js
const express = require('express')
const app = express()
```

## Routing

Routing mengacu pada penentuan bagaimana aplikasi merespons permintaan klien endpoint tertentu, yang merupakan URI (atau path) dan metode permintaan HTTP tertentu (GET, POST, dan sebagainya).

##	Routing dengan `const app = express()`

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

### Routing dengan `const router = express.Router()`

Gunakan express.Router untuk membuat router yang modular dan mudah dipasang.

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
Tambahkan router ke aplikasi express

```js
app.use('/', router)
```

## Middleware

Fungsi middleware adalah fungsi yang memiliki akses ke objek request, objek respons, dan fungsi next. Middleware dapat membuat perubahan pada objek request dan objek respons.

- 	Middleware tingkat aplikasi

    ```js
    app.use((req, res, next) => {
        // code ...
        next()
    })
    ```
- 	Middleware tingkat router

    ```js
    router.get('/', (req, res, next) => {
        // code ...
        next()
    }, (req, res, next) => {
        res.send('GET request to the homepage')
    })
    ```
- 	Middleware penanganan NotFound

	```js
	app.use((req, res, next) => {
		res.status(404).json({ message: "Not Found" })
	})
	```
- 	Middleware penanganan kesalahan

    ```js
    app.use((err, req, res, next) => {
        console.error(err.stack)
        res.status(500).send('Something broke!')
    })
    ```

::: post-navigation
[Buat Aplikasi REST ExpressJS Sederhana](/post/express-rest-mongodb-crud-jest "berikutnya")
:::