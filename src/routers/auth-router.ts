import { Router } from 'express';
import * as authController from '../controllers/auth-controller';

const router = Router();

router.post('/token', authController.generateToken);
router.post('/revoke', authController.revokeToken);
router.post('/revokeall', authController.revokeAllToken);
router.post('/check', authController.checkToken);
router.get('/tokens', authController.getAllTokens);

export default router;