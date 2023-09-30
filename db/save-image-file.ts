import fs from 'fs';
import { join } from 'path';
import { getImagesBucket } from '../src/services/image-service';
import { fromStream } from 'file-type';
import { SYSTEM } from '../src/configs/auth-constant';

const imagesFolder = join(process.env.ROOT_DIR || process.cwd(), 'db', 'images');

(async () => {
    console.log('[MONGODB] test data');

    try {
        const bucket = await getImagesBucket();
        const originalName = "react-tailwind-init.png";

        const filePath = join(imagesFolder, originalName);

        if (fs.existsSync(filePath)) {
            console.log(`saving ${filePath} ...`);

            const stream = fs.createReadStream(filePath);
            const type = await fromStream(stream);

            fs.createReadStream(filePath).
                pipe(bucket.openUploadStream(originalName, {
                    metadata: {
                        createdBy: SYSTEM,
                        originalName,
                        contentType: type?.mime as string
                    }
                }));
        } else {
            console.log(`${filePath} is not exist`);
        }

    } catch (error: any) {
        console.log(error);
    } finally {
        setTimeout(function () {
            process.exit();
        }, 2000);
    }

})()