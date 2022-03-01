import express from 'express';

const router = express.Router();

router.get('/status', (req, res) => {
  res.status(200).send('The API is working');
});

export default router;
