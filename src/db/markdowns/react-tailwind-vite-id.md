# Buat Aplikasi React dan Tailwind CSS dengan ***create-vite***

React is a javascript library used to build application interfaces. Tailwind CSS is a framework for building web applications. The combination of React JS and Tailwind CSS is often used to build web applications. **create-vite** merupakan alat untuk memulai proyek dengan cepat, dari template dasar untuk framework populer termasuk React.

## Requirement

1. Node >= 14 

## Resources

1. [Vite](https://vitejs.dev/guide/)
2. [Install Tailwind CSS with Vite](https://tailwindcss.com/docs/guides/vite)


## Steps

1. Buat Aplikasi React

    ```
    npm create vite@latest tailwind-vite-ts -- --template react-ts
    ```

    Masuk ke dalam folder
    ```
    cd tailwind-vite-ts
    ```

    Lihat kode dengan Visual Studio Code
    ```
    code .
    ```

1. Instal librari

    ```
    npm install
    ```

1. Jalankan aplikasi

    ```
    npm run dev
    ```


1. Lihat tautan ***http://localhost:5173/***

    ![create-react-vite-init.png](create-react-vite-init.png)



1. Instal librari Tailwind CSS

    ```
    npm install -D tailwindcss postcss autoprefixer
    ```

1. Buat konfigurasi Tailwind

    ```
    npx tailwindcss init -p
    ```

1. Ubah ***tailwind.config.js***

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

1. Ubah ***src/index.css***

    ```
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
    ```

1. Ubah ***src/App.tsx***

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

1. Hapus berkas yang tidak digunakan

    - src/App.css

1. Lihat tautan ***http://127.0.0.1:5173/***

    ![create-react-tailwind-vite-init.png](create-react-tailwind-vite-init.png)


1. Tes kode untuk produksi di lokal

    ```
    npm run build
    npm run preview
    ```

    Lihat tautan ***http://127.0.0.1:4173/***

1. Tes kode di lokal dengan [npm serve](https://github.com/vercel/serve)

    Tambahkan skrip ini di ***package.json***

    ```
    "serve": "npx serve -p 4173 -s dist"
    ```

    Jalankan skrip ini
    ```
    npm run build
    npm run serve
    ```

    Lihat tautan ***http://127.0.0.1:4173/***

## Lihat kode di Github

 https://github.com/ferrylinton/react-sample/tree/main/tailwind-vite-ts