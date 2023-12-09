# 	Menyiapkan Lingkungan Pengembangan Untuk Node JS dengan CommonJS

Posting ini akan menjelaskan cara mengatur lingkungan pengembangan untuk Node JS dengan CommonJS (bukan aplikasi web). Mempersiapkan konfigurasi sederhana unutk alat dan librari yang akan digunakan dalam pengembangan aplikasi seperti JEST, ESLint, Prettier, Husky, dan Lint-staged.

## 	Persyaratan

1. 	[Node](https://nodejs.org/en)
1. 	[Visual Studio Code](https://code.visualstudio.com/)

## 	Referensi

1.  [NodeJS](https://nodejs.org/api/modules.html)
1.  [JEST](https://jestjs.io/docs/getting-started)
1.  [ESLint](https://eslint.org/docs/latest/use/getting-started)
1.  [Prettier](https://prettier.io/docs/en/)
1.  [Husky](https://typicode.github.io/husky/getting-started.html)
1.  [lint-staged](https://github.com/lint-staged/lint-staged#readme)

## 	Buat Aplikasi Node Sederhana

1.  Buat folder ***node-commonjs-starter*** (atau nama proyekmu)

	```console
	mkdir node-commonjs-starter
	cd node-commonjs-starter
	```

1.	Inisialisasi git

	```console
	git init
	git branch -M main
  	git remote add origin  ***your_repository_url***
	```
	
1.	Inisialisasi aplikasi node

	```console
	npm init --yes
	```

1.  Lihat kode yang dihasilkan dengan Visual Studio Code.

    ```console
    code .
    ```

## 	Mempersiapkan Variabel Environment

1.	Instal ***cross-env*** dan ***dotenv***

	-	**[cross-env](https://www.npmjs.com/package/cross-env)** atur variabel lingkungan yang lintas platform dengan perintah yang sama. 
	-	**[dotenv](https://www.npmjs.com/package/dotenv)** memuat variabel lingkungan dari file .env ke process.env.

		```console
		npm i cross-env dotenv
		``` 

1.	Buat file-file ini dan tambahkan variabel

	-	***.env.development*** 

		```
		APP_USERNAME=user_development
		```

	- 	***.env.production***

		```
		APP_USERNAME=user_production
		```

	- 	***.env.test***

		```
		APP_USERNAME=user_test
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

    // melempar kesalahan jika envFile tidak ditemukan
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

## Membuat Kode Sederhana

1.  Buat berkas ***src\services\hello-service.js***, dan tambahkan kode berikute.

    Kode ini adalah fungsi hello yang sederhana.

    ```js
    const { APP_USERNAME, NODE_ENV } = require("../configs/env-constant");

    function sayHello() {
        // kode ini akan menampilkan variabel dari file .env
        return `Hello ${APP_USERNAME} on ${NODE_ENV} mode`;
    }

    module.exports = {
        sayHello
    };
    ```

1.  Buat berkas ***src\index.js***, dan tambakan kode berikut.

    Berkas ini akan dipanggil untuk menjalankan aplikasi.

    ```js
    const { sayHello } = require('./services/hello-service');

    // panggil fungsi sayHello, dan cetak hasilnya
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

1.	Ubah berkas ***package.json*** dan tambahkan skrip berikut

	```
	...
	"start": "cross-env NODE_ENV=production node src/index.js",
	"dev": "cross-env NODE_ENV=development node src/index.js",
	"test": "cross-env NODE_ENV=test jest",
	...

	```
1.  Uji kode dengan menjalankan skrip ini. 

    -   Jalankan aplikasi dengan mode pengembangan.

        ```console
        npm run dev
        ```

    -   Jalankan aplikasi dengan mode produksi.

        ```console
        npm start
        ```

    -   Jalankan aplikasi dengan mode tes.

        ```console
        npm test
        ```
        ![node-commonjs-starter-01.png](node-commonjs-starter-01.png)

## Mempersiapkan ESLint

1.  Inisialisasi ESLint

    ```console
    npm init @eslint/config
    ```
	Pilih konfigurasi ini.

    ![node-commonjs-starter-02.png](node-commonjs-starter-02.png)

1.	Instal ***Jest***

	```console
	npm install --save-dev jest eslint-plugin-jest
	```

1.  Instal ***Prettier***

    ```console
    npm install --save-dev --save-exact prettier
    npm install --save-dev eslint-plugin-prettier eslint-config-prettier
    ```

1.	Buat berkas ***.prettierrc.json*** file, dan tambahkan konfigurasi berikut.

    ```json
    {
		"trailingComma": "es5",
		"tabWidth": 4,
		"useTabs": true,
		"printWidth": 100,
		"semi": true,
		"singleQuote": true,
		"quoteProps": "consistent",
		"arrowParens": "avoid"
	}
    ```

1.	Buat berkas ***.prettierignore***, dan tambahkan teks berikut.

    ```
    # Ignore artifacts:
	build
	coverage

	# Ignore all HTML files:
	**/*.html

	package-lock.json
    ```

1.  Ubah berkas ***.eslintrc.js***, dan tambahkan konfigurasi berikut.

    ```js
    module.exports = {
		env: {
			commonjs: true,
			node: true,
			es6: true,
			jest: true,
		},
		extends: ['plugin:prettier/recommended', 'prettier', 'eslint:recommended'],
		overrides: [
			{
				files: ['.eslintrc.{js,cjs}', '**/*.test.js'],
				parserOptions: {
					sourceType: 'script',
				},
				plugins: ['jest'],
			},
		],
		parserOptions: {
			ecmaVersion: 'latest',
		},
		rules: {
			'prettier/prettier': 'warn',
			'no-unused-vars': 'warn',
			'no-var': 'warn',
			'prefer-const': 'warn',
		},
	};
    ```

## Mempersiapkan Husky

1.  Inisialisasi skrip pre-commit husky

    ```console
    npx husky-init
    ```

1.  Ubah berkas ***.husky\pre-commit***, dan tambahkan kode berikut.

    ```
    #!/usr/bin/env sh
    . "$(dirname -- "$0")/_/husky.sh"

    npx lint-staged
    ```

1.  Instal ***lint-staged***

    ```console
    npm install --save-dev lint-staged
    ```


## Uji Konfigurasi Proyek

1.  Ubah berkas ***package.json***, dan tambahkan kode berikut.

    ```json
    {
		"name": "commonjs-starter",
		"version": "1.0.0",
		"description": "Node (CommonJS) boilerplate project",
		"main": " src/index.js",
		"repository": {
			"type": "git",
			"url": "git+https://github.com/ferrylinton/node-commonjs-starter.git"
		},
		"keywords": [
			"node",
			"commonjs",
			"eslint",
			"prettier",
			"husky"
		],
		"author": "Ferry L. H.",
		"license": "ISC",
		"bugs": {
			"url": "https://github.com/ferrylinton/node-commonjs-starter/issues"
		},
		"homepage": "https://github.com/ferrylinton/node-commonjs-starter#readme",
		"scripts": {
			"dev": "node src/index.js",
			"lint": "eslint .",
			"lint:fix": "eslint --fix .",
			"format": "prettier . --write",
			"prepare": "husky install"
		},
		"husky": {
			"hooks": {
				"pre-commit": "lint-staged"
			}
		},
		"lint-staged": {
			"**/*.js": [
				"npm run lint:fix",
				"npm run format"
			]
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
			"husky": "^8.0.0",
			"jest": "^29.7.0",
			"lint-staged": "^15.1.0",
			"prettier": "3.1.0"
		}
	}
    ```

1. Uji semua konfigurasi dengan menjalankan **git commit**

	```console
	git add .
	git commit -m "test lint-stage"
	```
	Pesan-pesan ini akan ditampilkan jika konfigurasi berfungsi.

	```
	[STARTED] Preparing lint-staged...
	[COMPLETED] Preparing lint-staged...
	[STARTED] Running tasks for staged files...
	[STARTED] package.json — 2 files
	[STARTED] **/*.js — 1 file
	[STARTED] npm run lint:fix
	[COMPLETED] npm run lint:fix
	[STARTED] npm run format
	[COMPLETED] npm run format
	[COMPLETED] **/*.js — 1 file
	[COMPLETED] package.json — 2 files
	[COMPLETED] Running tasks for staged files...
	[STARTED] Applying modifications from tasks...
	[COMPLETED] Applying modifications from tasks...
	[STARTED] Cleaning up temporary files...
	[COMPLETED] Cleaning up temporary files...
	[main 8ce8a5e] test lint-stage
	```
	**Note**
  	- 	Jika pesan ini muncul di konsol

		```console
		fatal: cannot run .husky/pre-commit: No such file or directory
		```
    	Hapus folder ***.husky***, dan jalankan skrip berikut.

		```console
		npx husky-init
		```
		Ubah berkas ***.husky\pre-commit***, dan tambahkan kode berikut.
		```
		#!/usr/bin/env sh
		. "$(dirname -- "$0")/_/husky.sh"

		npx lint-staged
		```

	- 	Jika pesan ini muncul di konsol
		```console
		warning: in the working copy of '.eslintrc.js', LF will be replaced by CRLF the next time Git touches it
		warning: in the working copy of '.husky/pre-commit', LF will be replaced by CRLF the next time Git touches it
		warning: in the working copy of '.prettierrc.json', LF will be replaced by CRLF the next time Git touches it
		warning: in the working copy of 'package-lock.json', LF will be replaced by CRLF the next time Git touches it
		warning: in the working copy of 'package.json', LF will be replaced by CRLF the next time Git touches it
		```
    	Jalankan skrip ini atau abaikan saja

		```console
		git config --local core.autocrlf false
		```

## Kode

[https://github.com/ferrylinton/node-commonjs-starter](https://github.com/ferrylinton/node-commonjs-starter)

