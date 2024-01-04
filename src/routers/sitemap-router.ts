import { Router } from 'express';
import * as sitemapController from '../controllers/sitemap-controller';

const router = Router();

router.get('/', sitemapController.find);

export default router;