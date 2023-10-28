import { Router } from 'express';
import * as imageController from '../controllers/image-controller';
import { uploadImage } from '../middleware/upload-handler';
import { hasAuthority } from '../middleware/has-authority-handler';
import { IMAGE_ADMIN, IMAGE_OWNER } from '../configs/auth-constant';


const router = Router();
router.get("/", imageController.find);
router.get("/:id", imageController.findById);
router.get("/view/:idOrFilename", imageController.viewByIdOrFilename);
router.post('/upload', hasAuthority(IMAGE_OWNER), uploadImage, imageController.create);
router.delete("/:id", hasAuthority(IMAGE_ADMIN), imageController.deleteById);
router.delete("/:owner/:id", hasAuthority(IMAGE_OWNER), imageController.deleteById);

export default router;