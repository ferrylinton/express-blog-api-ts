import { Router } from 'express';
import requestIp from 'request-ip';
import parser from 'ua-parser-js';
import i18n from 'i18n';

const router = Router();

router.get('/', (req, res) => {
    const userAgent = parser(req.headers['user-agent']);
    const clientIp = requestIp.getClientIp(req);
    console.log({ clientIp, ...userAgent });

    res.status(200).json({ clientIp, ...userAgent });
});

router.get('/locale', (req, res) => {
    console.log(req.locale);
    const message: string = req.__('home');

    res.status(200).json({ message });
});

export default router;