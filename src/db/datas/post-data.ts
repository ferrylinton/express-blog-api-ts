import fs from "fs";
import { join } from "path";
import { SYSTEM } from "../../configs/auth-constant";
import * as postService from "../../services/post-service";

const markdownsFolder = join(process.env.ROOT_DIR || process.cwd(), `/src/db/markdowns`);

export const initPostData = async () => {
    try {
        const slug = "react-tailwind-setupxx";
        const tags = ["React", "Tailwind CSS"];
        const createdBy = SYSTEM;
        const createdAt = new Date();
        const title = {
            id: "Buat Aplikasi React dan Tailwind CSS dengan",
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
}