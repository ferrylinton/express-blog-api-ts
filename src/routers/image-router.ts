import { Router } from 'express';
import * as imageController from '../controllers/image-controller';
import { uploadImage } from '../middleware/upload-handler';
import { hasAuthority } from '../middleware/has-authority-handler';
import { IMAGE_ADMIN, IMAGE_OWNER } from '../configs/auth-constant';
import { ipWhitelistHandler } from '../middleware/ip-whitelist-handler';


const router = Router();
router.get("/", imageController.find);
router.get("/:id", imageController.findById);
router.get("/view/:idOrFilename", imageController.viewByIdOrFilename);
router.post('/upload', ipWhitelistHandler, hasAuthority([IMAGE_OWNER]), uploadImage, imageController.create);
router.delete("/:id", ipWhitelistHandler, hasAuthority([IMAGE_OWNER, IMAGE_ADMIN]), imageController.deleteById);

export default router;