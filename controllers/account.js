import responder from '../utils/responseHandler.js';
import userService from '../services/user.js';
import ValidationError from '../utils/errors/validationError.js';
import httpErrors from '../utils/errors/constants.js';

import accountsUtil from '../utils/account.js';
import userDb from '../db/user.js';
import accountDb from '../db/account.js';

const linkAccount = async (req, res, next) => {
    try{
        const {
            body: {
                bankName, userName, password
            }
        } = req;
        const user = await userDb.getUserDetailsUsingId(req.userId);

        const accountDetails = accountsUtil.generateBankAccount({
            bankName, userName, password, userId: req.userId, email: user.email
        });

        const response = await accountDb.addAccount(accountDetails);
        const transactions = accountsUtil.generateTransactions({
          email: accountDetails.uniqueUserId, 
          accountId: accountDetails.id,
          no: 8,
          balance: accountDetails.balance,
          fromDate: '1/1/2021',
          toDate: '6/1/2021'
        });
        await accountDb.updateAccountBalance({email: accountDetails.email, balance: transactions.closeBalance});
        await accountDb.addTransactions(transactions);
        const updatedAccountDetails = await accountDb.getAccountDetails({email: user.email});
        return responder(res)(null, {accountDetails: updatedAccountDetails, transactions: transactions.transactions, numOfTransactions: transactions.transactions.length});

    } catch (ex){
        return next(ex);
    }
};

const getAccountDetails = async (req, res, next) => {
  try {
    const user = await userDb.getUserDetailsUsingId(req.userId);
    const accountDetails = await accountDb.getAccountDetails({email: user.email});
    return responder(res)(null, {accountDetails});
  } catch (ex) {
      return next(ex);
  }
}

const getTransactions = async (req, res, next) => {
  try {
    const user = await userDb.getUserDetailsUsingId(req.userId);
    const transactions = await accountDb.getAllTransactions({email: user.email})
    return responder(res)(null, {transactions});
  } catch (ex) {
      return next(ex);
  }
}

const sync = async (req, res, next) => {
  try {
    const user = await userDb.getUserDetailsUsingId(req.userId);
    const accountDetails = await accountDb.getAccountDetails({email: user.email})
    const transactions = accountsUtil.generateTransactions({
      email: accountDetails.uniqueUserId, 
      accountId: accountDetails.id,
      no: 4,
      balance: accountDetails.balance,
      fromDate: '6/2/2021',
      toDate: '8/2/2021'
    });
    await accountDb.updateAccountBalance({email: accountDetails.email, balance: transactions.closeBalance});
    await accountDb.addTransactions(transactions);
    const updatedTransactions = await accountDb.getAllTransactions({email: user.email});
    return responder(res)(null, {transactions: updatedTransactions, numOfTransactions: updatedTransactions.length});
  } catch (ex) {
      return next(ex);
  }
}

export default {
  linkAccount,
  getAccountDetails,
  getTransactions,
  sync
};
