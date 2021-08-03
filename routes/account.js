import { Router } from 'express';

import accountController from '../controllers/account.js';
import utils from '../utils/utils.js';

const router = Router();

router.post('/linkAccount', accountController.linkAccount);
router.post('/getAccountDetails', accountController.getAccountDetails);
router.post('/getTransactions', accountController.getTransactions);
router.post('/sync', accountController.sync);

export default router;
