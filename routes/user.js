import { Router } from 'express';

import userController from '../controllers/user.js';
import validations from '../validations/user.js';

const {
  signUpValidate,
  base64PwdSignup
} = validations;

const router = Router();

router.post('/signUp', base64PwdSignup, signUpValidate, userController.userSignUp);

export default router;
