import { Router } from 'express';

import accountController from '../controllers/account.js';
import utils from '../utils/utils.js';
// import validations from '../validations/user.js';

// const {
//   verifyAuthToken
// } = validations;

const router = Router();

router.post('/linkAccount', utils.verifyAuthToken, accountController.linkAccount);
router.post('/getAccountDetails', utils.verifyAuthToken, accountController.getAccountDetails);
router.post('/getTransactions', utils.verifyAuthToken, accountController.getTransactions);
router.post('/sync', utils.verifyAuthToken, accountController.sync);

router.use(utils.verifyAuthToken);
// all other routes to be added below 

export default router;
