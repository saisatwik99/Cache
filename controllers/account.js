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
        const user = req.user;
        const accountDetails = accountsUtil.generateBankAccount({
            bankName, userName, password, userId: user._id, email: user.email
        });
        const transactions = accountsUtil.generateTransactions({
          email: accountDetails.uniqueUserId, 
          accountId: accountDetails.id,
          no: 8,
          balance: accountDetails.balance,
          fromDate: '1/1/2021',
          toDate: '6/1/2021'
        });
        
        await accountDb.addAccount(accountDetails),
        await accountDb.updateAccountBalance({email: accountDetails.email, balance: transactions.closeBalance}),
        await accountDb.addTransactions(transactions)
        
        const updatedAccountDetails = await accountDb.getAccountDetails({email: user.email});
        res.redirect("/api/account/home")
        // return responder(res)(null, {accountDetails: updatedAccountDetails, transactions: transactions.transactions, numOfTransactions: transactions.transactions.length});

    } catch (ex){
        return next(ex);
    }
};

const getLinkAccount = async (req, res, next) => {
  try {
    const user = req.user;
    res.render('linkAccount', {user})
  } catch (ex) {
      return next(ex);
  }
}

const getAccountDetails = async (req, res, next) => {
  try {
    const user = req.user;
    const accountDetails = await accountDb.getAccountDetails({email: user.email});
    const transactions = await accountDb.getAllTransactions({email: user.email});
    
    var exist = false;
    if(accountDetails !== undefined) {
      exist = true;
    }
    res.render('accounts', {account: accountDetails, transDetails: transactions, user, exist})
  } catch (ex) {
      return next(ex);
  }
}

const getTransactions = async (req, res, next) => {
  try {
    const user = req.user;
    const transactions = await accountDb.getAllTransactions({email: user.email})
    return responder(res)(null, transactions);
  } catch (ex) {
      return next(ex);
  }
}

const sync = async (req, res, next) => {
  try {
    const user = req.user;
    const accountDetails = await accountDb.getAccountDetails({email: user.email})
    const transactions = accountsUtil.generateTransactions({
      email: accountDetails.uniqueUserId, 
      accountId: accountDetails.id,
      no: 4,
      balance: accountDetails.balance,
      fromDate: '6/2/2021',
      toDate: '8/2/2021'
    });
    
    await accountDb.updateAccountBalance({email: accountDetails.email, balance: transactions.closeBalance}),
    await accountDb.addTransactions(transactions)
    
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
  sync,
  getLinkAccount
};
