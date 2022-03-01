import express from 'express';
import auth from '../controller/auth.js';
import authMiddleware from '../middleware';

const router = express.Router();

router.get('/protected', authMiddleware, (req, res, next) => {
  res.status(200).json({
    success: true,
    msg: 'You are successfully authenticated to this route!',
  });
});

router.route('/login').post(auth.authLogin);
router.route('/register').post(auth.authRegister);

export default router;
