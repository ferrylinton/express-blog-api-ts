import { Router } from 'express';
import * as userController from '../controllers/user-controller';
import { hasAuthority } from '../middleware/has-authority-handler';
import { BASIC, MODIFY_USER_DATA, READ_USER_DATA } from '../configs/auth-constant';
import { ipWhitelistHandler } from '../middleware/ip-whitelist-handler';

const router = Router();

router.get('/', ipWhitelistHandler, hasAuthority([READ_USER_DATA]), userController.find);
router.post('/', ipWhitelistHandler, hasAuthority([MODIFY_USER_DATA]), userController.create);
router.get("/:idOrUsername", ipWhitelistHandler, hasAuthority([READ_USER_DATA, BASIC]), userController.findByIdOrUsername);
router.put("/:id", ipWhitelistHandler, hasAuthority([MODIFY_USER_DATA]), userController.update);
router.delete("/:id", ipWhitelistHandler, hasAuthority([MODIFY_USER_DATA]), userController.deleteById);

router.post('/:id/changepassword', ipWhitelistHandler, hasAuthority([MODIFY_USER_DATA]), userController.changePasswordById);
router.post('/changepassword', ipWhitelistHandler, userController.changePassword);

export default router;