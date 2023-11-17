import { Router } from 'express';
import * as authorityController from '../controllers/authority-controller';
import { hasAuthority } from '../middleware/has-authority-handler';
import { MODIFY_USER_DATA, READ_USER_DATA } from '../configs/auth-constant';
import { ipWhitelistHandler } from '../middleware/ip-whitelist-handler';

const router = Router();

router.get('/', ipWhitelistHandler, hasAuthority([READ_USER_DATA]), authorityController.find);
router.post('/', ipWhitelistHandler, hasAuthority([MODIFY_USER_DATA]), authorityController.create);
router.get("/:id", ipWhitelistHandler, hasAuthority([READ_USER_DATA]), authorityController.findById);
router.put("/:id", ipWhitelistHandler, hasAuthority([MODIFY_USER_DATA]), authorityController.update);
router.delete("/:id", ipWhitelistHandler, hasAuthority([MODIFY_USER_DATA]), authorityController.deleteById);

export default router;