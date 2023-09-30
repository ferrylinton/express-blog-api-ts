import { fromStream } from 'file-type';
import fs from 'fs';
import { join } from 'path';
import { SYSTEM } from '../src/configs/auth-constant';
import { getImagesBucket } from '../src/services/image-service';

const imagesFolder = join(process.env.ROOT_DIR || process.cwd(), 'db', 'images');

(async () => {
    console.log('[MONGODB] test data');

    try {
        const bucket = await getImagesBucket();

        fs.readdirSync(imagesFolder).forEach(async originalName => {
            try {
                const filePath = join(imagesFolder, originalName);
                if (fs.existsSync(filePath)) {
                    console.log(`saving ${filePath} ...`);

                    const stream = fs.createReadStream(filePath);
                    const type = await fromStream(stream);

                    stream.
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

            } catch (error) {
                console.log(error);
            }
        });
    } catch (error: any) {
        console.log(error);
    } finally {
        setTimeout(function () {
            process.exit();
        }, 2000);
    }


})()