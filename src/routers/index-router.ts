import { Router } from 'express';
import requestIp from 'request-ip';

const router = Router();

router.get('/', (req, res) => {
    const userAgent = req.headers['user-agent'];
    const hostIp = req.ip;
    const clientIp = requestIp.getClientIp(req);

    res.status(200).json({ hostIp, clientIp, userAgent });
});

router.get('/locale', (req, res) => {
    const message: string = req.__('home');

    res.status(200).json({ message });
});

export default router;