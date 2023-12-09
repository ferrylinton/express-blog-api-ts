#   JSDoc Simple Example

JSDoc is a library used to document Javascript code. This post will show you how to configure JSDoc with Node Applications.

## 	Requirement

1. 	[Node](https://nodejs.org/en)
1. 	[Visual Studio Code](https://code.visualstudio.com/)

## 	Reference

1.  [NodeJS](https://nodejs.org/api/modules.html)
1.  [JSDoc](https://jsdoc.app/)
1.  [rimraf](https://github.com/isaacs/rimraf#readme)

##  Steps

1.  Create node application

    ```console
    npm init -y
    ```
1.  Install library

    ```console
    npm install --save-dev jsdoc rimraf
    ```
1.  Add ***package.json*** file, and add the following configuration.

    ```json
    {
        "name": "jsdoc-simple",
        "version": "1.0.0",
        "description": "JSDoc Simple Example",
        "main": "src/index.js",
        "scripts": {
            "dev": "node src/index.js",
            "doc": "rimraf docs && jsdoc -c jsdoc.json"
        },
        "keywords": [
            "node",
            "jsdoc"
        ],
        "author": "ferrylinton",
        "license": "ISC",
        "devDependencies": {
            "jsdoc": "^4.0.2",
            "rimraf": "^5.0.5"
        }
    }
    ```

1.  Add ***jsdoc.json*** file, and add the following configuration. 

    This file is JSDoc configuration file, check this link https://jsdoc.app/about-configuring-jsdoc

    ```json
    {
        "source": {
            "include": "src",
            "includePattern": ".js$"
        },
        "opts": {
            "template": "node_modules/docdash",
            "destination": "./docs/",
            "readme": "./readme.md",
            "recurse": true
        }
    }
    ```
    Description:

    -   **"source"** :

        -   **"include"** : "src"
            
            Generate documentation for files inside the ***src*** folder

        -   **"includePattern"** : ".js$"

            Generate documentation for files with extension ***.js***

    -   **"opts"** :
        
        -   **"template"** : "node_modules/docdash"

            JSDoc will use template ***docdash***

        -   **"destination"** : "./docs/"

            JSDoc will be created in the ***docs*** folder

        -   **"readme"** : "./README.md"

            The ***README.md*** content will shown on JSDoc's home page

        -   **"recurse"** : true

            Recursion is enabled

1.  Add ***src\services\calculator-service.js*** file, and add the follwing code.

    This code shows how to add documentation within the code.

    ```js
    /**
    * Provides a simple calculation process
    * @module CalculatorService
    */

    /**
    * Sum two numbers
    * @param {number} a - A number to add
    * @param {number} b - A number to add
    * @returns {number} The sum of a and b
    */
    exports.sum = (a, b) => {
        return a + b;
    }

    /**
    * Divides two numbers
    * @param {number} a - The dividend
    * @param {number} b - The divisor
    * @returns {number} The quotient of a and b
    * @throws {Error} If b is zero
    */
    exports.divide = (a, b) => {
        if (b === 0) {
            throw new Error('Cannot divide by zero')
        }
        return a / b
    }
    ```

1.  Add ***src\index.js*** file, and add the following code.
    ```js
    const { sum, divide} = require('./services/calculator-service');

    /**
    * @constant {number}  sumResult - Sum results
    */
    const sumResult = sum(1,2);
    console.log('>>>>>>>>> 1 + 2 = ', sumResult);

    /**
    * @constant {number}  divideResult - Division results
    */
    const divideResult = divide(1,2);
    console.log('>>>>>>>>> 1 / 2 = ', divideResult);
    console.log('....exit\n\n');
    ```
1.  Add ***README.md*** file, and add this content.

    ```md
    # JSDoc Simple Example

    JSDoc is a library used to document Javascript code. This post will show you how to configure JSDoc with Node Applications.

    ## 	Requirement

    1. 	[Node](https://nodejs.org/en)
    1. 	[Visual Studio Code](https://code.visualstudio.com/)

    ## 	Reference

    1.  [NodeJS](https://nodejs.org/api/modules.html)
    1.  [JSDoc](https://jsdoc.app/)

    ## Install Library

        ```console
        npm install --save-dev jsdoc
        ```
    ```

1.  Test code

    ```console
    npm run dev
    ```

    Result

    ![jsdoc-simple-01.png](jsdoc-simple-01.png)

1.  Generate documentation

    ```console
    npm run doc
    ```
    Open ***docs\index.html*** to see generated docs.

    ![jsdoc-simple-02.png](jsdoc-simple-02.png)

##  Source Code

https://github.com/ferrylinton/nodejs-sample/tree/main/jsdoc-simple