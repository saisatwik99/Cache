import moment from 'moment';
import responder from '../utils/responseHandler.js';
import userService from '../services/user.js';
import ValidationError from '../utils/errors/validationError.js';
import httpErrors from '../utils/errors/constants.js';
import utils from '../utils/utils.js';
import InvalidJwtError from '../utils/errors/invalidToken.js';
import userDB from '../db/user.js';
import accountDb from '../db/account.js';

const getSignup = (req, res) => res.render('signup');

const userSignUp = async (req, res, next) => {
  try {
    const {
      body: {
        firstName, lastName, email, password, dob, confirmPassword
      }
    } = req;
    console.log(req.body);
    if (password !== confirmPassword) {
      return next(new ValidationError(httpErrors.SIGNUP_VALIDATION_ERROR));
    }
    const token = await userService.userSignUp({
      firstName, lastName, email, password, dob
    });
    req.session.authtoken = token;
    return res.redirect('/api/user/dashboard');
  } catch (ex) {
    return next(ex);
  }
};

const getLogin = (req, res) => {
  console.log('Why I am here');
  res.render('login');
};

const userLogin = async (req, res, next) => {
  try {
    const {
      body: {
        email, password
      }
    } = req;
    const token = await userService.userLogin({ email, password });
    req.session.authtoken = token;
    console.log(token);
    res.redirect('/api/user/dashboard');
  } catch (ex) {
    return next(ex);
  }
};

const dashboard = async (req, res) => {
  const { user } = req;
  const userDetails = await userDB.getUserDetails({ email: user.email });
  const transactions = await accountDb.getAllTransactions({ email: user.email });
  var modifiedTransactions = transactions;
  if(transactions.length > 0) {
    modifiedTransactions.forEach((ele) => {
      ele.date = moment(ele.date).format('D MMM, YY');
      if (ele.amount < 0) {
        ele.status = 'Debit';
        ele.amount *= (-1);
      } else {
        ele.status = 'Credit';
      }
    });
    modifiedTransactions = modifiedTransactions.slice(0, 5);
  }
  
  const isThere = transactions.length > 0;
  res.render('dashboard', { user: userDetails, transactions: modifiedTransactions, isThere });
};

const billPayments = (req, res) => {
  res.render('billPayments');
};

const accounts = (req, res) => {
  res.render('accounts');
};

const billMobile = (req, res) => {
  res.render('mobile');
};

const isTokenValid = async (req, res, next) => {
  try {
    const decoded = utils.isTokenValid(req, res, next);
    return responder(res)(null, { valid: true, tokenData: decoded });
  } catch (error) {
    return next(new InvalidJwtError('INVALID TOKEN'));
  }
};

const logout = async (req, res, next) => {
  try {
    return req.session.destroy((err) => {
      console.error('error while destroying session', err);
      res.redirect('/api/user/login');
    });
  } catch (ex) {
    return next(ex);
  }
};

export default {
  getSignup,
  userSignUp,
  userLogin,
  getLogin,
  dashboard,
  billPayments,
  billMobile,
  accounts,
  isTokenValid,
  logout
};
