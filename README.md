# Blog's REST API

REST API application for the ***marmeam.com*** blog

##  Running Application In Development Environment

1.  Add ***.env*** file and add all configuration from ***.env.dev.sample***

1.  Run application

    ```console
    npm run dev
    ```

##  Running Application In Production Environment

1.  Add ***.env*** file and add all configuration from ***.env.prod.sample***

1.  Build source code

    ```console
    npm run build
    ```

1.  Start application with pm2

    ```console
    pm2 start apps.json
    ```