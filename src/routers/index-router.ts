import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
    const headers = req.headers;
    res.status(200).json({ headers });
});

router.get('/locale', (req, res) => {
    const message: string = req.__('home');
    res.status(200).json({ message });
});

export default router;