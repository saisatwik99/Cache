import express from 'express';

const router = express.Router();

router.get('/health', (req, res, next) => res.send("Up & running"));

export default router;
