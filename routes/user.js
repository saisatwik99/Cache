import { Router } from 'express';

import userController from '../controllers/user.js';
import utils from '../utils/utils.js';
import validations from '../validations/user.js';

const {
  signUpValidate,
  base64PwdSignup,
  loginValidate
} = validations;

const router = Router();

router.post('/signUp', base64PwdSignup, signUpValidate, userController.userSignUp);
router.post('/login', loginValidate, userController.userLogin);

router.use(utils.verifyAuthToken);
// all other routes to be added below 

export default router;
