import { Router } from 'express';

import authController from '../controllers/auth.js';
import validations from '../validations/auth.js';

const {
  signUpValidate,
  base64PwdSignup
} = validations;

const router = Router();

router.post('/signUp', base64PwdSignup, signUpValidate, authController.userSignUp);

export default router;
