#   JSDoc With Docdash Example

You can generate documentation with JSDoc using a template that has been provided or using a template from a third party. ***docdash*** is a template created by the JSDoc community. ***docdash*** is a clean, responsive documentation template theme for JSDoc 3.

## 	Requirement

1. 	[Node](https://nodejs.org/en)
1. 	[Visual Studio Code](https://code.visualstudio.com/)

## 	Reference

1.  [NodeJS](https://nodejs.org/api/modules.html)
1.  [JSDoc](https://jsdoc.app/)
1.  [Docdash](https://clenemt.github.io/docdash/)
1.  [rimraf](https://github.com/isaacs/rimraf#readme)

##   Steps

1.  Create Node Application With JSDoc

    See this post, [JSDoc Simple Example](https://marmeam.com/post/jsdoc-simple)

1.  Install docdash

    ```console
    npm install --save-dev docdash
    ```

2.  Modify ***jsdoc.json*** file, and add the following configuration. 

    This file is JSDoc configuration file, check this link https://jsdoc.app/about-configuring-jsdoc.

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
        },
        "docdash": {
            "sort": true,
            "search": true,
            "menu": {
                "Github repo": {
                    "href": "https://github.com/ferrylinton/nodejs-sample/tree/main/jsdoc-crud",
                    "target": "_blank",
                    "class": "menu-item",
                    "id": "repository"
                }
            }
        }
    }
    ```
    Description :

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

    -   **"docdash"** :

        -   **"sort"** : true

            Sort menu

        -   **"search"**: true

            Add search bar

        -   "**menu**":

            -   **"Github repo"** :

                Added menu **Github repo** with the following configuration :

                -   href: https://github.com/ferrylinton/nodejs-sample/tree/main/jsdoc-crud

                -   target: _blank

                -   class: menu-item

                -   id: repository


1.  Generate documentation

    ```console
    npm run doc
    ```
    Open ***docs\index.html*** to see generated docs.

    JSDoc with docdash

    ![jsdoc-docdash-01.png](jsdoc-docdash-01.png)

    JSDoc with default template

    ![jsdoc-docdash-02.png](jsdoc-docdash-02.png)

##  Source Code

https://github.com/ferrylinton/nodejs-sample/tree/main/jsdoc-docdash