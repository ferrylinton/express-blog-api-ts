import { Router } from 'express';
import * as userController from '../controllers/user-controller';
import { hasAuthority } from '../middleware/has-authority-handler';
import { BASIC, MODIFY_USER_DATA, READ_USER_DATA } from '../configs/auth-constant';

const router = Router();

router.get('/', hasAuthority([READ_USER_DATA]), userController.find);
router.post('/', hasAuthority([MODIFY_USER_DATA]), userController.create);
router.get("/:idOrUsername", hasAuthority([READ_USER_DATA, BASIC]), userController.findByIdOrUsername);
router.put("/:id", hasAuthority([MODIFY_USER_DATA]), userController.update);
router.delete("/:id", hasAuthority([MODIFY_USER_DATA]), userController.deleteById);

router.post('/:id/changepassword', hasAuthority([MODIFY_USER_DATA]), userController.changePasswordById);
router.post('/changepassword', userController.changePassword);

export default router;