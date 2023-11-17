import { Router } from 'express';
import * as authController from '../controllers/auth-controller';
import { ipWhitelistHandler } from '../middleware/ip-whitelist-handler';

const router = Router();

router.post('/token', ipWhitelistHandler, authController.generateToken);
router.post('/revoke, ipWhitelistHandler', authController.revokeToken);
router.post('/revokeall', ipWhitelistHandler, authController.revokeAllToken);
router.post('/check', ipWhitelistHandler, authController.checkToken);
router.get('/tokens', ipWhitelistHandler, authController.getAllTokens);

export default router;