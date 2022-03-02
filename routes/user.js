import express from 'express';
import user from '../controller/user.js';
import authMiddleware from '../middleware';

const router = express.Router();

router.get('', authMiddleware, user.getUser);
router.put('/update/:id', authMiddleware, user.updateUser);

export default router;
