import express from 'express';
import utils from '../utils/utils.js';

import user from './user.js';

const router = express.Router();

router.use(express.json({ limit: '20mb' }));
router.use(express.urlencoded({ limit: '20mb', extended: false }));

// eslint-disable-next-line no-unused-vars
router.get('/health', (req, res, next) => res.send('Up & running'));
router.use('/user', user);

router.use(utils.verifyAuthToken);
// other routes to be added

export default router;
