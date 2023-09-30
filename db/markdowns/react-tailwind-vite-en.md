# Create React App And Tailwind CSS with ***create-vite***

React is a javascript library used to build application interfaces. Tailwind CSS is a framework for building web applications. The combination of React JS and Tailwind CSS is often used to build web applications. **create-vite** is a tool to quickly start a project from a basic template for popular frameworks including React.

## Requirement

1. Node >= 14 

## Resources

1. [Vite](https://vitejs.dev/guide/)
2. [Install Tailwind CSS with Vite](https://tailwindcss.com/docs/guides/vite)


## Steps

1. Create React App

    ```
    npm create vite@latest tailwind-vite-ts -- --template react-ts
    ```

    Go to folder
    ```
    cd tailwind-vite-ts
    ```

    Open source code with Visual Studio Code
    ```
    code .
    ```

1. Install libraries

    ```
    npm install
    ```

1. Run on development mode

    ```
    npm run dev
    ```


1. Go to url ***http://localhost:5173/***

    ![create-react-vite-init.png](create-react-vite-init.png)



1. Install Tailwind library

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

1. Go to url ***http://127.0.0.1:5173/***

    ![create-react-tailwind-vite-init.png](create-react-tailwind-vite-init.png)


1. Locally preview production build

    ```
    npm run build
    npm run preview
    ```

    Go to url ***http://127.0.0.1:4173/***

1. Testing the App Locally with [npm serve](https://github.com/vercel/serve)

    Add this script to ***package.json***

    ```
    "serve": "npx serve -p 4173 -s dist"
    ```

    Run this command
    ```
    npm run build
    npm run serve
    ```

    Go to url ***http://127.0.0.1:4173/***

## See source code on Github

 https://github.com/ferrylinton/react-sample/tree/main/tailwind-vite-ts