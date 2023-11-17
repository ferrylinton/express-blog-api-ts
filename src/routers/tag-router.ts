import { Router } from 'express';
import { BLOG_ADMIN, BLOG_OWNER } from '../configs/auth-constant';
import * as tagController from '../controllers/tag-controller';
import { hasAuthority } from '../middleware/has-authority-handler';
import { ipWhitelistHandler } from '../middleware/ip-whitelist-handler';

const router = Router();

router.get('/', tagController.find);
router.post('/', ipWhitelistHandler, hasAuthority([BLOG_OWNER]), tagController.create);
router.get("/:id", tagController.findById);
router.put("/:id", ipWhitelistHandler, hasAuthority([BLOG_OWNER]), tagController.update);
router.delete("/:id", ipWhitelistHandler, hasAuthority([BLOG_ADMIN, BLOG_OWNER]), tagController.deleteById);

export default router;