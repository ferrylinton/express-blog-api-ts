import { Router } from 'express';
import * as todoController from '../controllers/todo-controller';

const router = Router();

router.get('/', todoController.find);
router.post('/', todoController.create);
router.get("/:id", todoController.findById);
router.put("/:id", todoController.update);
router.delete("/:id", todoController.deleteById);

export default router;