import fs from 'fs';
import { join } from 'path';
import { SYSTEM } from '../../configs/auth-constant';
import * as tagService from "../../services/tag-service";

const svgsFolder = join(process.env.ROOT_DIR || process.cwd(), `/src/db/svgs`);

export const initTagData = async () => {
    try {
        const createdBy = SYSTEM;
        const createdAt = new Date();

        await tagService.create({
            name: "Express.js",
            description: {
                id: "Express.js, or simply Express, is a back end web application framework for building RESTful APIs with Node.js",
                en: "Express.js, atau Express, adalah framework back end untuk membangun RESTful API dengan Node.js"
            },
            logo: fs.readFileSync(join(svgsFolder, 'expressjs.svg'), 'utf-8'),
            createdBy,
            createdAt
        });

        await tagService.create({
            name: "Mongodb",
            description: {
                id: "MongoDB is a source-available cross-platform document-oriented database program",
                en: "MongoDB adalah program database berorientasi dokumen"
            },
            logo: fs.readFileSync(join(svgsFolder, 'mongodb.svg'), 'utf-8'),
            createdBy,
            createdAt
        });

        await tagService.create({
            name: "Next.js",
            description: {
                id: "Next.js is an open-source web development framework created by the private company Vercel providing React-based web applications with server-side rendering and static website generation",
                en: "Next.js adalah frameowrk untuk web yang dibuat oleh perusahaan Vercel yang menyediakan aplikasi web berbasis React"
            },
            logo: fs.readFileSync(join(svgsFolder, 'nextjs.svg'), 'utf-8'),
            createdBy,
            createdAt
        });

        await tagService.create({
            name: "Node.js",
            description: {
                id: "Node.js is a back-end JavaScript runtime environment, runs on the V8 JavaScript engine, and executes JavaScript code outside a web browser",
                en: "Node.js adalah back-end mengunakan runtime JavaScript, berjalan pada JavaScript V8, dan dapat mengeksekusi kode JavaScript di luar browser web"
            },
            logo: fs.readFileSync(join(svgsFolder, 'nodejs.svg'), 'utf-8'),
            createdBy,
            createdAt
        });

        await tagService.create({
            name: "Postgresql",
            description: {
                id: "PostgreSQL, also known as Postgres, is a free and open-source relational database management system emphasizing extensibility and SQL compliance",
                en: "PostgreSQL, juga dikenal sebagai Postgres, adalah sistem manajemen basis data relasional sumber terbuka dan gratis yang menekankan ekstensibilitas dan kepatuhan SQL"
            },
            logo: fs.readFileSync(join(svgsFolder, 'postgresql.svg'), 'utf-8'),
            createdBy,
            createdAt
        });

        await tagService.create({
            name: "React",
            description: {
                id: "React is a free and open-source front-end JavaScript library for building user interfaces based on components",
                en: "React adalah libari JavaScript untuk front-end, ope source dan gratis untuk membangun antarmuka pengguna berdasarkan komponen"
            },
            logo: fs.readFileSync(join(svgsFolder, 'react.svg'), 'utf-8'),
            createdBy,
            createdAt
        });

        await tagService.create({
            name: "Tailwind CSS",
            description: {
                id: "Tailwind CSS is an open source CSS framework",
                en: "Tailwind CSS adalah framework CSS yang open source"
            },
            logo: fs.readFileSync(join(svgsFolder, 'tailwindcss.svg'), 'utf-8'),
            createdBy,
            createdAt
        });

        await tagService.create({
            name: "Typescript",
            description: {
                id: "Typescript is designed for the development of large applications and transpiles to JavaScript",
                en: "TypeScript dirancang untuk pengembangan aplikasi besar dan ditranspilasi ke JavaScript"
            },
            logo: fs.readFileSync(join(svgsFolder, 'typescript.svg'), 'utf-8'),
            createdBy,
            createdAt
        });


    } catch (error) {
        console.log(error);
    }
}