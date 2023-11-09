import { Router } from 'express';
import { TASK_ADMIN, TASK_OWNER } from '../configs/auth-constant';
import * as todoController from '../controllers/todo-controller';
import { hasAuthority } from '../middleware/has-authority-handler';

const router = Router();

router.get('/', todoController.find);
router.post('/', hasAuthority([TASK_OWNER]), todoController.create);
router.get("/:id", todoController.findById);
router.put("/:id", hasAuthority([TASK_ADMIN]), todoController.update);
router.delete("/:id", hasAuthority([TASK_ADMIN]), todoController.deleteById);
router.put("/:owner/:id", hasAuthority([TASK_OWNER]), todoController.update);
router.delete("/:owner/:id", hasAuthority([TASK_OWNER]), todoController.deleteById);

export default router;