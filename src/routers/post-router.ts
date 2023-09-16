import { Router } from 'express';
import { BLOG_ADMIN, BLOG_OWNER } from '../configs/auth-constant';
import * as postController from '../controllers/post-controller';
import { hasAuthority } from '../middleware/has-authority-handler';

const router = Router();

router.get('/', postController.find);
router.post('/', hasAuthority(BLOG_OWNER), postController.create);
router.get("/:id", postController.findById);
router.put("/:id", hasAuthority(BLOG_ADMIN), postController.update);
router.delete("/:id", hasAuthority(BLOG_ADMIN), postController.deleteById);
router.put("/:owner/:id", hasAuthority(BLOG_OWNER), postController.update);
router.delete("/:owner/:id", hasAuthority(BLOG_OWNER), postController.deleteById);

export default router;