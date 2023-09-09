import { Router } from 'express';
import * as authController from '../controllers/auth-controller';

const router = Router();

router.post('/token', authController.generateToken);
router.post('/revoke', authController.revokeToken);

export default router;