import Joi from '@hapi/joi';

import ValidationError from '../utils/errors/validationError.js';
import InputParamError from '../utils/errors/inputParamError.js';
import httpErrors from '../utils/errors/constants.js';
import utils from '../utils/utils.js';

const {
  PASSWORDS_BASE64_CORRUPTED,
  LOGIN_VALIDATION_ERROR,
  SIGNUP_VALIDATION_ERROR,
  // CHECKUSER_VALIDATION_ERROR,
  // UPDATEUSER_VALIDATION_ERROR,
  PASSWORDS_NO_MATCH_ERROR
  // VALIDATION_ERROR
} = httpErrors;

const base64 = Joi.string().base64();

// eslint-disable-next-line max-len
const emailRegex = /^[-!#$%&'*+/0-9=?A-Z^_a-z`{|}~](\.?[-!#$%&'*+/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
const passRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$/;

const password = (passField = 'password') => Joi.string()
  .min(8)
  .max(50)
  .required()
  .pattern(passRegex)
  .messages({
    'string.base': 'Something went wrong.',
    'string.pattern.base': 'Password should have an uppercase, a lowercase, a number and a special character',
    'string.min': 'password should have a minimum length of {#limit}',
    'string.max': 'password should have a maximum length of {#limit}',
    'any.required': `${passField} is required`,
    'string.empty': `${passField} is not allowed to be empty`
  });

const getAge = (birthDateString) => {
  console.log(birthDateString);
  if (!birthDateString) {
    throw new InputParamError('Date of Birth Not Found');
  }
  const today = new Date();
  const birthDate = new Date(birthDateString);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  // if birthday is yet to come for the current year then age should be deceased by 1
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age -= 1;
  }
  return age;
};

const logInSchema = Joi.object({
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: true }
    })
    .pattern(emailRegex)
    .required(),
  password: password()
});

const signUpSchema = Joi.object({
  firstName: Joi.string().required().min(1).max(250),
  lastName: Joi.string().min(1).max(250).optional(),
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: true }
  }).pattern(emailRegex).required(),
  password: password(),
  confirmPassword: password('confirmPassword'),
  dob: Joi.number().required().min(18).message('age should be greater than or equal to 18')
});

const base64PwdSignup = async ({ body }, res, next) => {
  try {
    if (body.password !== body.confirmPassword) {
      return next(new ValidationError('Passwords Do Not Match', PASSWORDS_NO_MATCH_ERROR));
    }
    await base64.validateAsync(body.password || '');
    await base64.validateAsync(body.confirmPassword || '');
    return next();
  } catch (err) {
    return next(new ValidationError(err.details, PASSWORDS_BASE64_CORRUPTED));
  }
};

const signUpValidate = ({ body }, res, next) => signUpSchema.validateAsync({
  ...body,
  password: utils.base64toString(body.password),
  confirmPassword: utils.base64toString(body.confirmPassword),
  dob: getAge(body.dob)
})
  .then(() => next())
  .catch((err) => next(new ValidationError(err.details, SIGNUP_VALIDATION_ERROR)));

const loginValidate = ({ body }, res, next) => logInSchema.validateAsync({
  ...body,
  password: utils.base64toString(body.password)
})
  .then(() => next())
  .catch((err) => next(new ValidationError(err.details[0].message, LOGIN_VALIDATION_ERROR)));

export default {
  signUpValidate,
  base64PwdSignup,
  loginValidate
};
