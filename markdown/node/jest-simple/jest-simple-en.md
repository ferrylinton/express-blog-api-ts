#   Simple Example of JEST

Unit testing aims to check a small portion of the application code, which is usually a function in the application code. This post contains an example of a unit testing node application using Jest. Jest is a fun JavaScript Testing Framework with a focus on simplicity.

##  Requirement

1.  [Node](https://nodejs.org/en)
1.  [Node - Test](https://nodejs.org/api/test.html)
1.  [Visual Studio Code](https://code.visualstudio.com/)

##  Reference

1.  [NodeJS](https://nodejs.org/api/modules.html)
1.  [Jest](https://jestjs.io/docs/getting-started)
1.  [ESlint](https://eslint.org/docs/latest/use/getting-started)

##  Create Node Application

See these posts:

-	[Setup Node Application With Eslint (Common JS)](https://marmeam.com/post/eslint-commonjs-setup)
-	[Setup Node Application With Eslint And Prettier (Common JS)](https://marmeam.com/post/eslint-prettier-commonjs-setup)

##  Setup JEST

1.  Install Jest.

    ```console
    npm install jest eslint-plugin-jest --save-dev
    ```

1.  Modify ***.eslintrc.js*** file.

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

1.  Modify ***package.json*** file, and add the following code

    ```json
    {
		"name": "jest-simple",
		"version": "1.0.0",
		"description": "Simple Example of JEST (Common JS)",
		"main": " src/index.js",
		"scripts": {
			"start": "node src/index.js",
			"dev": "node src/index.js",
			"test": "jest",
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
		"devDependencies": {
			"eslint": "^8.54.0",
			"eslint-config-prettier": "^9.0.0",
			"eslint-config-standard": "^17.1.0",
			"eslint-plugin-import": "^2.29.0",
			"eslint-plugin-n": "^16.3.1",
			"eslint-plugin-prettier": "^5.0.1",
			"eslint-plugin-promise": "^6.1.1",
			"jest": "^29.7.0",
			"prettier": "3.1.0"
		}
	}
    ```

##	Create Simple Code

1.	Create ***src\calculator.js*** file, and add the following code.

	```js
	function sum(a, b) {
		return a + b;
	}

	module.exports = {
		sum
	};
	```

1.  Create ***test\calculator.test.js*** file, and add the following code.

    ```js
    const { sum } = require("../src/calculator");

    // name
    test("adds 1 + 2 to equal 3", () => {
      // executes the function to be tested
      const result = sum(1, 2);

      // check the result
      expect(result).toBe(3);
    });
    ```

    Check **[NodeJS#testname-options-fn](https://nodejs.org/api/test.html#testname-options-fn)** for more informasi.

1.  Run test script, and JEST will show the result.

    ```console
    npm test
    ```

    ![jest-simple-01.png](jest-simple-01.png)

## Kode

https://github.com/ferrylinton/nodejs-sample/tree/main/jest-simple
