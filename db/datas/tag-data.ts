import { SYSTEM } from '../../src/configs/auth-constant';
import * as tagService from "../../src/services/tag-service";
import { createSlug } from '../../src/util/string-util';

export const initTagData = async () => {
    try {
        const createdBy = SYSTEM;
        const createdAt = new Date();

        await tagService.create({
            name: createSlug("Express.js"),
            createdBy,
            createdAt
        });

        await tagService.create({
            name: createSlug("Mongodb"),
            createdBy,
            createdAt
        });

        await tagService.create({
            name: createSlug("Next.js"),
            createdBy,
            createdAt
        });

        await tagService.create({
            name: createSlug("Node.js"),
            createdBy,
            createdAt
        });

        await tagService.create({
            name: createSlug("Postgresql"),
            createdBy,
            createdAt
        });

        await tagService.create({
            name: createSlug("React"),
            createdBy,
            createdAt
        });

        await tagService.create({
            name: createSlug("Tailwind CSS"),
            createdBy,
            createdAt
        });

        await tagService.create({
            name: createSlug("Typescript"),
            createdBy,
            createdAt
        });


    } catch (error) {
        console.log(error);
    }
}