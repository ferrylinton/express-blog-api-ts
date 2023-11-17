import { Router } from 'express';
import { BLOG_ADMIN, BLOG_OWNER } from '../configs/auth-constant';
import * as postController from '../controllers/post-controller';
import { hasAuthority } from '../middleware/has-authority-handler';
import { ipWhitelistHandler } from '../middleware/ip-whitelist-handler';

const router = Router();

router.get('/', postController.find);
router.post('/', ipWhitelistHandler, hasAuthority([BLOG_OWNER]), postController.create);
router.get("/:idOrSlug", postController.findByIdOrSlug);
router.put("/:id", ipWhitelistHandler, hasAuthority([BLOG_OWNER]), postController.update);
router.delete("/:id", ipWhitelistHandler, hasAuthority([BLOG_ADMIN, BLOG_OWNER]), postController.deleteById);

export default router;