import { Router } from 'express';
import * as imageController from '../controllers/image-controller';
import { uploadImage } from '../middleware/upload-handler';


const router = Router();
router.get("/", imageController.find);
router.get("/:filename", imageController.findByFilename);
router.post('/upload', uploadImage, imageController.create);
router.delete("/:id", imageController.deleteById);

export default router;