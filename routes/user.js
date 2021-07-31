import { Router } from 'express';

import authController from '../controllers/user.js';
import validations from '../validations/user.js';

const {
  signUpValidate,
  base64PwdSignup
} = validations;

const router = Router();

router.post('/signUp', base64PwdSignup, signUpValidate, authController.userSignUp);

export default router;
