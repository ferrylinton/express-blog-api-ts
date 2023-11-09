import { Router } from 'express';
import { BLOG_ADMIN, BLOG_OWNER } from '../configs/auth-constant';
import * as tagController from '../controllers/tag-controller';
import { hasAuthority } from '../middleware/has-authority-handler';

const router = Router();

router.get('/', tagController.find);
router.post('/', hasAuthority([BLOG_OWNER]), tagController.create);
router.get("/:id", tagController.findById);
router.put("/:id", hasAuthority([BLOG_ADMIN, BLOG_OWNER]), tagController.update);
router.delete("/:id", hasAuthority([BLOG_ADMIN, BLOG_OWNER]), tagController.deleteById);

export default router;