import fs from "fs";
import { join } from "path";
import * as postService from "../../src/services/post-service";
import { createSlug } from '../../src/util/string-util';

const markdownsFolder = join(process.env.ROOT_DIR || process.cwd(), `/db/markdowns`);
const regex = /\]\((.+)(?=(\.(svg|gif|png|jpe?g)))/g;
const createdBy = 'ferrylinton';

const replaceUrl = (filePath: string) => {
    let content = fs.readFileSync(filePath, "utf-8");
    return content.replace(regex, (_fullResult, imagePath) => {
        const newImagePath = `/api/images/view/${imagePath}.${createdBy}`
        return `](${newImagePath}`;
    })
}

const padWithLeadingZeros = (num: number) => {
    return String(num).padStart(5, '0');
}

export const initPostData = async () => {
    try {
        const arr: string[] = [];

        for (let i = 0; i < 1; i++) {
            arr.push(padWithLeadingZeros(i))
        }

        arr.forEach(async txt => {
            const slug = "react-tailwind-setup" + "-" + txt;
            const tags = [createSlug("React"), createSlug("Tailwind CSS")];
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
                id: replaceUrl(join(markdownsFolder, "react-tailwind-id.md")),
                en: replaceUrl(join(markdownsFolder, "react-tailwind-en.md"))
            }

            await postService.create({ slug, tags, title, description, content, createdBy, createdAt });
        });


    } catch (error) {
        console.log(error);
    }
}