#   Buat Aplikasi REST Express Sederhana

ExpressJS adalah kerangka aplikasi web untuk aplikasi node dan yang paling populer. Berikut ini cara membuat aplikasi sederhana dengan ExpressJS.

##  Persyaratan

1.  [Node](https://nodejs.org/en)
1.  [VisualStudioCode](https://code.visualstudio.com/)

##  Referensi

1.  [Express](https://expressjs.com/en/starter/installing.html)

##  Create Node Application

```console
mkdir express-rest-simple
cd express-rest-simple
npm init --yes
```
##  Instal Librari

```console
npm i express cors helmet
```

Deskripsi :
-   [express](https://expressjs.com/) : Kerangka web yang cepat, tidak beropini, dan minimalis untuk Node.js
-   [cors](https://github.com/expressjs/cors#readme) : Mengaktifkan CORS (Cross-Origin Resource Sharing).
-   [helmet](https://helmetjs.github.io/) : Helmet membantu mengamankan aplikasi Express dengan mengatur header respons HTTP.

##  Buka kode yang dihasilkan dengan Visual Studio Code

```console
code .
```

##  Tambahkan Kode Sederhana

1.  Buat berkas ***src\routers\index-router.js***
    
    Berkas ini berisi kode sederhana REST API, untuk menampilkan data json sederhana

    ```js
    const express = require('express');

    /**
    * Buat Router baru
    */
    const router = express.Router();

    // Daftarkan permintaan ke endpoint dengan metode GET
    router.get('/', (req, res) => {
        res.status(200).json({ message: "Horas lae", NODE_ENV: process.env.NODE_ENV });
    });

    module.exports = router;
    ```

1.  Buat berkas ***src\app.js***

    Berkas ini berisi instansi aplikasi ekspres

    ```js
    const express = require('express');
    const helmet = require('helmet');
    const cors = require('cors');
    const indexRouter = require('./routers/index-router');

    /**
    * Membuat aplikasi Ekspres
    */
    const app = express();

    // helmet membantu mengamankan aplikasi Express dengan mengatur header respons HTTP
    app.use(helmet());

    // aktifkan CORS
    app.use(cors({ origin: '*' }));

    // mem-parsing permintaan masuk
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // map router ke aplikas express
    app.use('/', indexRouter);

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

1.  Buat berkas ***src\server.js***

    Berkas ini berisi kode yang akan memulai server dan mendengarkan koneksi pada port 5001

    ```js
    const app = require('./app');
    
    /**
     * @constant {number} aplikasi ekspres berjalan pada nomor port ini
    */
    const PORT = 5001;

    /**
    * Fungsi ini dipanggil setelah aplikasi Express dijalankan
    */
    const callback = () => {
        console.log(`[SERVER] Server is running at 'http://127.0.0.1:${PORT}'`);
    };

    /**
    * Fungsi ini adalah fungsi pertama yang dijalankan untuk memulai aplikasi Express.
    */
    const main = () => {
        try {
            // kode ini memulai aplikasi ekspres
            app.listen(PORT, "0.0.0.0", callback);
        } catch (error) {
            // Aplikasi akan berhenti jika terjadi kesalahan
            console.log(error);
            process.exit();
        }
    };

    // Eksekusi fungsi main()
    main();
    ```

1.  Mulai Aplikasi Ekspres

    Ubak berkas ***package.json***, dan tambahkan skrip ini

    ```json
    "scripts": {
		"dev": "node src/server.js"
	}
    ```
    Jalankan skrip

    ```console
    npm run dev
    ```

    Hasil

    ![express-rest-simple-01.png](express-rest-simple-01.png)
    
    Lihat di browser

    ![express-rest-simple-02.png](express-rest-simple-02.png)

##  Kode

::: github
[https://github.com/ferrylinton/express-sample/tree/main/express-rest-simple](https://github.com/ferrylinton/express-sample/tree/main/express-rest-simple)
::: 

::: post-navigation
[Membangun Aplikasi CRUD Dengan Expressjs Dan Mongodb](/post/express-rest-mongodb-crud "berikutnya")
:::