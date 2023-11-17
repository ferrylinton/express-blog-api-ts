# Setup React App And Tailwind CSS with ***create-react-app***

React is a javascript library used to build application interfaces. Tailwind CSS is a framework for building web applications. The combination of React JS and Tailwind CSS is often used to build web applications. Using create-react-app is one way to setup a React JS application.

## Requirement

1. Node >= 14 

## Resources

1. [Create React App - Adding TypeScript](https://create-react-app.dev/docs/adding-typescript)
2. [Install Tailwind CSS with Create React App](https://tailwindcss.com/docs/guides/create-react-app)

## Steps

1. Create React App

    ```
    npx create-react-app tailwind-ts --template typescript
    ```

    Go to folder
    ```
    cd tailwind-ts
    ```

    Open source code with Visual Studio Code
    ```
    code .
    ```

    If you get this error

    ```
    'create-react-app' is not recognized as an internal or external command
    ```
    Run this

    ```
    npx clear-npx-cache
    ```
    

1. Install libraries

    ```
    npm install
    ```

1. Run on development mode

    ```
    npm start
    ```

1. Go to url ***http://127.0.0.1:3000/***

    ![create-react-app-init.ferrylinton.png](create-react-app-init.ferrylinton.png)

1. Install Tailwind CSS library

    ```
    npm install -D tailwindcss postcss autoprefixer
    ```

1. Init Tailwind configuration

    ```
    npx tailwindcss init -p
    ```

1. Edit ***tailwind.config.js***

    ```
    /** @type {import('tailwindcss').Config} */
    export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {},
    },
    plugins: [],
    }
    ```

1. Edit ***src/index.css***

    ```
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
    ```

1. Edit ***src/App.tsx***

    ```
    function App() {

    return (
        <>
        <h1 className="text-3xl font-bold underline">
            Hello world!
        </h1>
        </>
    )
    }

    export default App
    ```

1. Delete unused file

    - src/App.css


1. Go to url ***http://127.0.0.1:3000/***

    ![react-tailwind-init.ferrylinton.png](react-tailwind-init.ferrylinton.png)

1. Test production code on local computer with [npm serve](https://github.com/vercel/serve)

    Add this script to package.json

    ```
    "serve": "npx serve -p 3001 -s build",
    ```

    Run this command
    ```
    npm run build
    npm run serve
    ```

    Go to url ***http://127.0.0.1:3001/***


## See source code

 - [https://github.com/ferrylinton/react-sample/tree/main/tailwind-ts](https://github.com/ferrylinton/react-sample/tree/main/tailwind-ts "Source Code")