import fs from 'fs';
import { join, extname } from 'path';
import * as imageService from "../src/services/image-service";
import * as tagService from "../src/services/tag-service";
import * as postService from "../src/services/post-service";
import { fromStream } from 'file-type';


export const getAllFiles = async function (dirPath: string, arrayOfFiles?: string[]) {
    const files = fs.readdirSync(dirPath)

    files.forEach(async function (file) {
        if (fs.statSync(join(dirPath, file)).isDirectory()) {
            getAllFiles(join(dirPath, file), arrayOfFiles)
        } else {
            if (extname(join(dirPath, file)) === '.json') {
                await savePostData(dirPath, file);
            } else if ([".png", ".jpg", ".jpeg", ".svg"].includes(extname(file))) {
                await saveImageData(dirPath, file);
            }
        }
    })

}

const savePostData = async (dirPath: string, file: string) => {
    console.log('POST :: slug = ', file);
    const post = JSON.parse(fs.readFileSync(join(dirPath, file), "utf-8"));
    await saveTagData(post.tags, post.createdBy);

    try {
        post.createdAt = new Date();
        post.content = {};
        post.content.id = fs.readFileSync(join(dirPath, `${post.slug}-id.md`), "utf-8");
        post.content.en = fs.readFileSync(join(dirPath, `${post.slug}-en.md`), "utf-8");
        await postService.create(post); 
    } catch (error) {
        console.log(error);
    }
}

const saveTagData = async (tags: string[], createdBy: string) => {
    const createdAt = new Date();

    tags.forEach(async name => {
        try {
            console.log('TAG :: name = ', name)
            await tagService.create({
                name,
                createdBy,
                createdAt
            });
        } catch (error) {
            console.log(error.message);
        }
    })
}

const saveImageData = async (dirPath: string, originalName: string) => {
    try {
        const bucket = await imageService.getImagesBucket();

        const stream = fs.createReadStream(join(dirPath, originalName));
        const { size } = fs.statSync(join(dirPath, originalName));
        const type = await fromStream(fs.createReadStream(join(dirPath, originalName)));
        const file: Express.Multer.File = {
            fieldname: '',
            originalname: originalName,
            encoding: '',
            mimetype: extname(originalName) === '.svg' ? 'image/svg+xml' : type?.mime || '',
            size: 0,
            stream,
            destination: '',
            filename: '',
            path: '',
            buffer: Buffer.from('')
        };

        imageService.create(bucket, "ferrylinton", file, (error, file) => {
            if (error) {
                console.log(error);
            } else {
                console.log(`${file?.originalname} is uploaded, size ${size}`);
            }
        });
    } catch (error) {
        console.log(error);
    }
}