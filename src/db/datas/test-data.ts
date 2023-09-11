import * as userService from "../../services/user-service";
import { handleMongoServerError } from "../../util/mongodb-util";
import { join } from "path";
import fs from 'fs';
import { ObjectId } from "mongodb";
import { getImagesBucket } from "../../services/image-service";

(async () => {
    console.log('[MONGODB] test data');

    try {
        const bucket = await getImagesBucket();
        bucket.drop();

        //bucket.delete(new ObjectId("64febdbac6b6ed4fec6e4071"));

        // const cursor = bucket.find ({filename: 'dddddd.png'});
        // for await (const doc of cursor) {
        //     console.log(doc);
        // }

        // const folder = join(process.env.ROOT_DIR || process.cwd(), `/src/db/images`);
        // const imagePath = join(folder, `EN.png`);

        // if (fs.existsSync(imagePath)) {
        //     const _id = new ObjectId();
        //     console.log(_id.toHexString());

        //     fs.createReadStream(imagePath)
        //         .pipe(bucket.openUploadStreamWithId(_id, 'EN.png', {
        //             metadata: { createdBy: 'username', originalName: 'EN.png' }
        //         }).on('error', function (error) {
        //             console.error(error);
        //         }).on('finish', async function () {
        //             console.log('done!');

        //             const cursor = bucket.find({ metadata: { createdBy: 'usernamed', originalName: 'EN.png' } });
        //             for await (const doc of cursor) {
        //                 console.log(doc);
        //             }
        //         }));


        // }



    } catch (error: any) {
        console.error(error);
        handleMongoServerError(error);
    }

    setTimeout(function () {
        process.exit();
    }, 2000);


})()