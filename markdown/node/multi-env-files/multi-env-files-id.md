# Menyiapkan Beberapa Berkas **.env** Untuk Pengembangan, Pengujian, dan Produksi

Saat membangun aplikasi, ada kemungkinan kita harus menyediakan beberapa konfigurasi berbeda untuk lingkungan pengembangan, pengujian, dan produksi. Posting ini akan menunjukkan cara membuat beberapa konfigurasi untuk beberapa file env menggunakan dotenv.

## Persyaratan

1. [Node](https://nodejs.org/en)
1. [Node - Test](https://nodejs.org/api/test.html)
1. [Visual Studio Code](https://code.visualstudio.com/)

## Referensi

1.  [NodeJS](https://nodejs.org/api/modules.html)
1.  [Jest](https://jestjs.io/docs/getting-started)
1.  [dotenv](https://github.com/motdotla/dotenv#readme)

##  Buat Aplikasi Node

Lihat postingan berikut:

-   [Mempersiapkan Aplikasi Node Dengan Eslint (Common JS)](https://marmeam.com/post/eslint-commonjs-setup)
-   [Mempersiapkan Aplikasi Node Dengan Eslint dan Prettier (Common JS)](https://marmeam.com/post/eslint-prettier-commonjs-setup)
-	[Contoh Sederhana JEST](https://marmeam.com/post/jest-simple)

##  Langkah-langkah

1.  Instal dotenv and cross-env

    ```console
    npm install dotenv cross-env
    ```

1.  Buat berkas ***src\configs\env-constant.js***, dan tambahkan kode berikut.

    ```js
    const fs = require('fs');
    const path = require('path');

    /**
    * Membuat nama file berdasarkan nilai NODE_ENV
    * 1. NODE_ENV=production => .env.production
    * 2. NODE_ENV=development => .env.development
    * 3. NODE_ENV=test => .env.test
    */
    const envFile = path.resolve(process.cwd(), `.env.${process.env.NODE_ENV || ''}`)

    // throw error jika berkas envFile tidak ditemukan
    if (!fs.existsSync(envFile)) {
        throw new Error(`${envFile} is not found`);
    }

    // memuat variabel lingkungan
    require('dotenv').config({
        path: envFile
    });

    module.exports = {
        NODE_ENV: process.env.NODE_ENV || 'development',
        APP_USERNAME: process.env.APP_USERNAME
    }
    ```
1.  Buat berkas ***src\services\hello-service.js***, dan tambahkan kode berikut.

    This code is a simple hello function.

    ```js
    const { APP_USERNAME, NODE_ENV } = require("../configs/env-constant");

    function sayHello() {
        // this code will show variables from .env file
        return `Hello ${APP_USERNAME} on ${NODE_ENV} mode`;
    }

    module.exports = {
        sayHello
    };
    ```

1.  Buat berkas ***src\index.js***, dan tambahkan kode berikut.

    This file is called to run the application.

    ```js
    const { sayHello } = require('./services/hello-service');

    // call sayHello function, and print the result
    const result = sayHello();
    console.log(result);
    ```

1.  Buat berkas ***test\services\hello-service.test.js***, dan tambahkan kode berikut.

    ```js
    const { sayHello } = require('../../src/services/hello-service');

    test('sayHello', () => { 

    const result = sayHello(); 
    console.log(result);
    expect(result).toBe('Hello user_test on test mode');
            
    });
    ```
1.  Ubah berkas ***package.json***.

    ```json
    {
        "name": "multi-env-files",
        "version": "1.0.0",
        "description": "Setup Multiple .env Files For Development, Testing And Production",
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
            "eslint",
            "prettier",
            "jest"
        ],
        "author": "ferrylinton",
        "license": "ISC",
        "dependencies": {
            "cross-env": "^7.0.3",
            "dotenv": "^16.3.1"
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

1.  Buat berkas ***.env***

    -   Buat berkas ***.env.development*** (mode pengembangan), dan tambahkan variabel ini.

        ```
        APP_USERNAME=user_development
        ```
    -   Buat berkas ***.env.production*** (mode produksi), dan tambahkan variabel ini.

        ```
        APP_USERNAME=user_production
        ```
    -   Buat berkas ***.env.test*** (mode tes), dan tambahkan variabel ini.

        ```
        APP_USERNAME=user_test
        ```

1.  Jalankan skrip.

    -   Jalankan aplikasi dengan mode pengembangan.

        ```console
        npm run dev
        ```
        ![multi-env-files-01.png](multi-env-files-01.png)

    -   Jalankan aplikasi dengan mode produksi.

        ```console
        npm start
        ```
        ![multi-env-files-02.png](multi-env-files-02.png)

    -   Jalankan aplikasi dengan mode tes.

        ```console
        npm test
        ```
        ![multi-env-files-03.png](multi-env-files-03.png)
    

## Kode

https://github.com/ferrylinton/nodejs-sample/tree/main/multi-env-files
