import { Router } from 'express';
import * as tagController from '../controllers/tag-controller';
import { hasAuthority } from '../middleware/has-authority-handler';
import { MODIFY_USER_DATA, READ_USER_DATA } from '../configs/auth-constant';

const router = Router();

router.get('/', hasAuthority(READ_USER_DATA), tagController.find);
router.post('/', hasAuthority(MODIFY_USER_DATA), tagController.create);
router.get("/:id", hasAuthority(READ_USER_DATA), tagController.findById);
router.put("/:id", hasAuthority(MODIFY_USER_DATA), tagController.update);
router.delete("/:id", hasAuthority(MODIFY_USER_DATA), tagController.deleteById);

export default router;