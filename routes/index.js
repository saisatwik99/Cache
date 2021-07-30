import express from 'express';

const router = express.Router();

router.use(express.json({ limit: '20mb' }));
router.use(express.urlencoded({ limit: '20mb', extended: false }));

router.get('/health', (req, res, next) => res.send('Up & running'));
// segregation of routes as per the modules here.

export default router;
