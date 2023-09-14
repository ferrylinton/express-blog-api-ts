import fs from 'fs';
import { join } from 'path';
import { SYSTEM } from '../../configs/auth-constant';
import * as tagService from "../../services/tag-service";

const svgsFolder = join(process.env.ROOT_DIR || process.cwd(), `/src/db/svgs`);

export const initTagData = async () => {
    const createdBy = SYSTEM;
    const createdAt = new Date();

    await tagService.create({
        name: "EXPRESJS",
        description: {
            id: "Express.js, or simply Express, is a back end web application framework for building RESTful APIs with Node.js",
            en: "Express.js, or simply Express, is a back end web application framework for building RESTful APIs with Node.js"
        },
        logo: fs.readFileSync(join(svgsFolder, 'expressjs.svg'), 'utf-8'),
        createdBy,
        createdAt
    })

}