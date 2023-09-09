import { Router } from 'express';
import requestIp from 'request-ip';
import parser from 'ua-parser-js';

const router = Router();

router.get('/', (req, res) => {
    const userAgent = parser(req.headers['user-agent']);
    const clientIp = requestIp.getClientIp(req);
    console.log({clientIp, ...userAgent});

    res.status(200).json({clientIp, ...userAgent});
});

export default router;