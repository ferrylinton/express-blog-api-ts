# Setup Node Application With Eslint And Prettier (Common JS)

Software Developers may use different coding styles than other software developers. If in one project there are multiple coding styles it will cause debate among developers. Software Developers can use Prettier as style guide.

## Requirement

1. [Node](https://nodejs.org/en)
1. [Visual Studio Code](https://code.visualstudio.com/)

## Reference

1.  [NodeJS](https://nodejs.org/api/modules.html)
1.  [ESLint](https://eslint.org/docs/latest/use/getting-started)
1.  [Prettier](https://prettier.io/docs/en/)

## Create Node Application

See this post **[Setup Node Application With Eslint (Common JS)](https://marmeam.com/post/eslint-commonjs-setup)**. 

##  Setup Prettier

1.  Install ***Prettier***

    ```console
    npm install --save-dev --save-exact prettier
    npm install --save-dev eslint-plugin-prettier eslint-config-prettier
    ```

1.	Create ***.prettierrc.json*** file, and add this configuration.

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

1.	Create ***.prettierignore*** file, and add this text.

    ```
    # Ignore artifacts:
	build
	coverage

	# Ignore all HTML files:
	**/*.html

	package-lock.json
    ```

1.  Modify ***.eslintrc.js*** file, and add this configuration.

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
1.  Modify ***package.json*** file, and add this code.

    ```json
    {
        "name": "eslint-prettier-commonjs",
        "version": "1.0.0",
        "description": "Node Application With Eslint And Prettier (Common JS)",
        "main": "src/index.js",
        "scripts": {
            "start": "node src/index.js",
            "dev": "node src/index.js",
            "lint": "eslint .",
            "lint:fix": "eslint . --fix",
            "format": "prettier . --write",
            "format:check": "prettier . --check"
        },
        "keywords": [
            "node",
            "eslint",
            "prettier"
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
            "prettier": "3.1.0"
        }
    }
    ```
1.  Test Prettier configuration by running this script.

    ```console
    npm run format
    ```
    Result

    ```console
    > eslint-prettier-commonjs@1.0.0 format
    > prettier . --write

    .eslintrc.js 96ms (unchanged)
    .prettierrc.json 8ms (unchanged)
    package.json 3ms (unchanged)
    src/calculator.js 7ms (unchanged)
    src/index.js 10ms (unchanged)    
    ```

## Source Code

[https://github.com/ferrylinton/nodejs-sample/tree/main/eslint-prettier-commonjs](https://github.com/ferrylinton/nodejs-sample/tree/main/eslint-prettier-commonjs)

    
