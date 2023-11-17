import fs from "fs";
import { join } from "path";
import * as postService from "../../src/services/post-service";
import { createSlug } from '../../src/util/string-util';

const markdownsFolder = join(process.env.ROOT_DIR || process.cwd(), `/db/markdowns`);

const padWithLeadingZeros = (num: number) => {
    return String(num).padStart(5, '0');
}

export const initPostData = async () => {
    insertSimple();
}

async function insertSimple() {
    const createdBy = 'ferrylinton';
    const createdAt = new Date();

    try {
        const slug = "react-tailwind-setup";
        const tags = [createSlug("React"), createSlug("Tailwind CSS")];

        const title = {
            id: "Buat Aplikasi React dan Tailwind CSS dengan create-react-app",
            en: "Setup React App And Tailwind CSS with create-react-app"
        };
        const description = {
            id: "React adalah librari javascript yang digunakan untuk membangun antar muka aplikasi. Tailwind CSS adalah framework untuk membangun web aplikasi. Kombinasi React JS dan Tailwind CSS sering digunakan untuk membangun aplikasi web. Menggunakan create-react-app merupakan salah satu cara untuk men-setup aplikasi  React JS.",
            en: "React is a javascript library used to build application interfaces. Tailwind CSS is a framework for building web applications. The combination of React JS and Tailwind CSS is often used to build web applications. Using create-react-app is one way to setup a React JS application."
        };
        const content = {
            id: fs.readFileSync(join(markdownsFolder, "react-tailwind-id.md"), "utf-8"),
            en: fs.readFileSync(join(markdownsFolder, "react-tailwind-en.md"), "utf-8")
        }

        await postService.create({ slug, tags, title, description, content, createdBy, createdAt });

    } catch (error) {
        console.log(error);
    }

    try {
        const slug = "react-tailwind-vite-setup";
        const tags = [createSlug("React"), createSlug("Tailwind CSS")];
        const title = {
            id: "Buat Aplikasi React dan Tailwind CSS dengan create-vite",
            en: "Setup React App And Tailwind CSS with create-vite"
        };
        const description = {
            id: "React is a javascript library used to build application interfaces. Tailwind CSS is a framework for building web applications. The combination of React JS and Tailwind CSS is often used to build web applications. create-vite merupakan alat untuk memulai proyek dengan cepat, dari template dasar untuk framework populer termasuk React.",
            en: "React is a javascript library used to build application interfaces. Tailwind CSS is a framework for building web applications. The combination of React JS and Tailwind CSS is often used to build web applications. create-vite is a tool to quickly start a project from a basic template for popular frameworks including React."
        };
        const content = {
            id: fs.readFileSync(join(markdownsFolder, "react-tailwind-vite-id.md"), "utf-8"),
            en: fs.readFileSync(join(markdownsFolder, "react-tailwind-vite-en.md"), "utf-8")
        }

        await postService.create({ slug, tags, title, description, content, createdBy, createdAt });

    } catch (error) {
        console.log(error);
    }
}

async function insertPosts() {
    try {
        const arr: string[] = [];

        for (let i = 0; i < 1; i++) {
            arr.push(padWithLeadingZeros(i))
        }

        arr.forEach(async txt => {
            const slug = "react-tailwind-setup" + "-" + txt;
            const tags = [createSlug("React"), createSlug("Tailwind CSS")];
            const createdBy = 'ferrylinton';
            const createdAt = new Date();
            const title = {
                id: "Buat Aplikasi React dan Tailwind CSS dengan" + "-" + txt,
                en: "Setup React App And Tailwind CSS with create-react-app" + "-" + txt
            };
            const description = {
                id: "React adalah librari javascript yang digunakan untuk membangun antar muka aplikasi. Tailwind CSS adalah framework untuk membangun web aplikasi. Kombinasi React JS dan Tailwind CSS sering digunakan untuk membangun aplikasi web. Menggunakan create-react-app merupakan salah satu cara untuk men-setup aplikasi  React JS." + "-" + txt,
                en: "React is a javascript library used to build application interfaces. Tailwind CSS is a framework for building web applications. The combination of React JS and Tailwind CSS is often used to build web applications. Using create-react-app is one way to setup a React JS application." + "-" + txt
            };
            const content = {
                id: fs.readFileSync(join(markdownsFolder, "react-tailwind-id.md"), "utf-8"),
                en: fs.readFileSync(join(markdownsFolder, "react-tailwind-en.md"), "utf-8")
            }

            await postService.create({ slug, tags, title, description, content, createdBy, createdAt });
        });


    } catch (error) {
        console.log(error);
    }
}