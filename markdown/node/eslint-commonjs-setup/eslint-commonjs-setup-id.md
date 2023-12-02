# Mempersiapkan Aplikasi Node Dengan Eslint (Common JS)

Visual Studio Code adalah IDE yang paling banyak digunakan untuk membuat aplikasi node. Aplikasi node bisa ditulis dengan modul CommonJS atau modul ECMAScript. Jika aplikasi node ditulis dengan modul CommonJS, Visual Studio Code belum bisa menunjukkan semua kesalahan di dalam kode tanpa bantuan ESLint. Postingan ini akan menunjukkan cara menyiapkan ESLint ke aplikasi node dan Visual Studio Code.

## Persyaratan

1. [Node](https://nodejs.org/en)
1. [Visual Studio Code](https://code.visualstudio.com/)

## Referensi

1.  [NodeJS](https://nodejs.org/api/modules.html)
1.  [ESlint](https://eslint.org/docs/latest/use/getting-started)


## Buat Aplikasi Node

1.  Buat folder ***node-commonjs-starter*** (atau nama proyekmu)

	```console
	mkdir node-commonjs-starter
	cd node-commonjs-starter
	```

1.  Inisialisasi aplikasi node

    ```console
    npm init --yes
    ```

1.  Lihat kode yang dihasilkan dengan Visual Studio Code.

    ```console
    code .
    ```

##  Membuat Kode Sederhana

1.  Buat berkas ***src\calculator.js*** dan tambahkan kode berikut.

    Kode tersebut merupakan fungsi sederhana untuk menjumlahkan 2 angka.

    ```js
    function sum(a, b) {
        return a + b;
    };

    module.exports = {
        sum
    };
    ```

1.  Buat berkas ***src\index.js***dan tambahkan kode berikut.

    Kode akan memanggil metode ***sum*** dari berkas ***src\calculator.js***.

    ```js
    const result = sum(1, 2);
    console.log(result);
    ```
    Kode salah karena fungsi ***sum*** belum ditentukan, tetapi Visual Studio Code tidak menunjukkan kesalahan apa pun.

    ![eslint-commonjs-setup-01.png](eslint-commonjs-setup-01.png)

    
1.  Jalankan berkas ***src/index.js***.

    ```console
    node src/index.js
    ```
    Hasilnya akan menunjukkan kesalahan karena kodenya masih salah.

    ```console
    const result = sum(1, 2);
               ^

    ReferenceError: sum is not defined
        at Object.<anonymous> (C:\Projects\nodejs\eslint-commonjs\src\index.js:1:16)
        at Module._compile (node:internal/modules/cjs/loader:1159:14)
        at Module._extensions..js (node:internal/modules/cjs/loader:1213:10)
        at Module.load (node:internal/modules/cjs/loader:1037:32)
        at Module._load (node:internal/modules/cjs/loader:878:12)
        at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:81:12)
        at node:internal/main/run_main_module:23:47
    ```

##  Siapkan Eslint

1.  Jalankan skrip ini.

    ```console
    npm init @eslint/config
    ```

    Pilih konfigurasi berikut

    ![eslint-commonjs-setup-02.png](eslint-commonjs-setup-02.png)

1.  Ubah berkas ***.eslintrc.js***, dan tambahkan kode berikut.

    ```js
    module.exports = {
        env: {
            commonjs: true,
            node: true,
            es6: true,
            jest: true,
        },
        extends: ['eslint:recommended'],
        overrides: [
            {
                files: ['.eslintrc.{js,cjs}', '**/*.test.js'],
                parserOptions: {
                    sourceType: 'script',
                }
            },
        ],
        parserOptions: {
            ecmaVersion: 'latest',
        },
        rules: {
            'no-unused-vars': 'warn',
            'no-var': 'warn',
            'prefer-const': 'warn',
        },
    };
    ```
1.  Instal ekstensi VS Code ESLint.

    ![eslint-commonjs-setup-02.png](eslint-commonjs-setup-03.png)

1.  Periksa kode setelah pengaturan ESLint.

    ![eslint-commonjs-setup-03.png](eslint-commonjs-setup-04.png)

    Kode Visual Studio menunjukkan kesalahan.

1.  Ubah berkas ***package.json*** dan tambahkan kode berikut.

    ```json
    {
        "name": "eslint-commonjs",
        "version": "1.0.0",
        "description": "Node Application With Eslint (Common JS)",
        "main": "src/index.js",
        "scripts": {
            "start": "node src/index.js",
            "lint": "eslint .",
                "lint:fix": "eslint . --fix"
        },
        "keywords": [
            "eslint",
            "node"
        ],
        "author": "Ferry L. H.",
        "license": "ISC",
        "devDependencies": {
            "eslint": "^8.54.0",
            "eslint-config-standard": "^17.1.0",
            "eslint-plugin-import": "^2.29.0",
            "eslint-plugin-n": "^16.3.1",
            "eslint-plugin-promise": "^6.1.1"
        }
    }
    ```
1.  Lint kode.

    ```console
    npm run lint
    ```
    Hasilnya akan menunjukkan kesalahan.

    ![eslint-commonjs-setup-05.png](eslint-commonjs-setup-05.png)

## Kesimpulan

Setelah Anda menyelesaikan langkah-langkah ini, dengan ESLint Anda dapat menemukan kode yang salah pada Visual Studio Code, atau dengan menjalankan skrip.

## Kode

[https://github.com/ferrylinton/nodejs-sample/tree/main/eslint-commonjs](https://github.com/ferrylinton/nodejs-sample/tree/main/eslint-commonjs)