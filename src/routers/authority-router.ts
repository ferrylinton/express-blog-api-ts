import { Router } from 'express';
import * as authorityController from '../controllers/authority-controller';
import { hasAuthority } from '../middleware/has-authority-handler';
import { MODIFY_USER_DATA, READ_USER_DATA } from '../configs/auth-constant';

const router = Router();

router.get('/', hasAuthority(READ_USER_DATA), authorityController.find);
router.post('/', hasAuthority(MODIFY_USER_DATA), authorityController.create);
router.get("/:id", hasAuthority(READ_USER_DATA), authorityController.findById);
router.put("/:id", hasAuthority(MODIFY_USER_DATA), authorityController.update);
router.delete("/:id", hasAuthority(MODIFY_USER_DATA), authorityController.deleteById);

export default router;