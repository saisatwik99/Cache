import express from 'express';
import user from './user.js';

const router = express.Router();

router.use(express.json({ limit: '20mb' }));
router.use(express.urlencoded({ limit: '20mb', extended: false }));

// eslint-disable-next-line no-unused-vars
router.get('/health', (req, res, next) => res.send('Up & running'));
// segregation of routes as per the modules here.
router.use('/user', user);

export default router;
