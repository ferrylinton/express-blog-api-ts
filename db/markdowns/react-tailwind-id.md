# Buat Aplikasi React dan Tailwind CSS dengan ***create-react-app***

React adalah librari javascript yang digunakan untuk membangun antar muka aplikasi. Tailwind CSS adalah framework untuk membangun web aplikasi. Kombinasi React JS dan Tailwind CSS sering digunakan untuk membangun aplikasi web. Menggunakan create-react-app merupakan salah satu cara untuk men-setup aplikasi  React JS.

## Persyaratan

1. Node >= 14 

## Sumber Informasi

1. [Create React App - Adding TypeScript](https://create-react-app.dev/docs/adding-typescript)
2. [Install Tailwind CSS with Create React App](https://tailwindcss.com/docs/guides/create-react-app)

## Langkah-langkah

1. Buat Aplikasi React

    ```shell
    npx create-react-app tailwind-ts --template typescript
    ```

    Masuk ke dalam folder

    ```shell
    cd tailwind-ts
    ```

    Lihat kode dengan Visual Studio Code

    ```shell
    code .
    ```

    Jika mendapatkan kesalahan ini

    ```shell
    'create-react-app' is not recognized as an internal or external command
    ```
    Jalankan perintah ini

    ```shell
    npx clear-npx-cache
    ```
    

1. Instal librari

    ```shell
    npm install
    ```

1. Jalankan aplikasi

    ```shell
    npm start
    ```

1. Lihat tautan ***http://127.0.0.1:3000/***

    ![create-react-app-init.png](create-react-app-init.png)

1. Instal librari Tailwind CSS

    ```shell
    npm install -D tailwindcss postcss autoprefixer
    ```

1. Buat konfigurasi Tailwind

    ```shell
    npx tailwindcss init -p
    ```

1. Ubah ***tailwind.config.js***

    ```js
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

1. Ubah ***src/index.css***

    ```css
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
    ```

1. Ubah ***src/App.tsx***

    ```js
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

1. Hapus berkas yang tidak digunakan

    - src/App.css


1. Lihat tautan ***http://127.0.0.1:3000/***

    ![react-tailwind-init.png](react-tailwind-init.png)

## Lihat kode di Github

 https://github.com/ferrylinton/react-sample/tree/main/tailwind-ts