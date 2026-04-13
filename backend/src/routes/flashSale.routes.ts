import { Router } from 'express';
import { getFlashSale, updateFlashSale } from '../controllers/flashSale.controller';
import { verifyToken } from '../middleware/auth.middleware';
import { isAdmin } from '../middleware/admin.middleware';

const router = Router();

router.get('/', getFlashSale);
router.post('/', verifyToken, isAdmin, updateFlashSale);

export default router;
