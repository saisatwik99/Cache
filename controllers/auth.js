import responder from '../utils/responseHandler.js';
import authService from '../services/auth.js';
import ValidationError from '../utils/errors/validationError.js';
import httpErrors from '../utils/errors/constants.js';

const userSignUp = async (req, res, next) => {
  try {
    const {
      body: {
        firstName, lastName, email, password, dob, confirmPassword
      }
    } = req;
    if (password !== confirmPassword) {
      return next(new ValidationError(httpErrors.SIGNUP_VALIDATION_ERROR));
    }
    const data = await authService.userSignUp({
      firstName, lastName, email, password, dob
    });

    return responder(res)(null, data);
  } catch (ex) {
    return next(ex);
  }
};

export default {
  userSignUp
};
