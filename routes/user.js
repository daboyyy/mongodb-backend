import express from 'express';
import user from '../controller/user.js';

const router = express.Router();

router.route('/update/:id').put(user.updateUser);

export default router;
