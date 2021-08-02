import db from './db.js';
import ConflictError from '../utils/errors/conflictError.js';

const accountCollectionRef = () => db.get().collection('accounts');
const transactionsCollectionRef = () => db.get().collection('transactions');

const addAccount = async (account) => {
    const isAccountPresent = await accountCollectionRef().findOne({ email: account.email });
    if (isAccountPresent){
        throw new ConflictError('Account Already exists');
    }
    return accountCollectionRef().insertOne(account);
}

const getAccountDetails = async ({email}) => accountCollectionRef().findOne({ uniqueUserId: email } );

const updateAccountBalance = async (account) => {
    const isAccountPresent = await accountCollectionRef().findOne({ email: account.email });
    if (!isAccountPresent){
        throw new ConflictError('Account does not exist');
    }
    return accountCollectionRef().updateOne({ email: account.email }, {$set: {balance: account.balance }});
}

const addTransactions = async (info) => {
    return transactionsCollectionRef().insertMany(info.transactions);
}

const getAllTransactions = async ({email}) => transactionsCollectionRef().find({ email } ).sort({date: -1}).toArray();

export default {
    addAccount,
    updateAccountBalance,
    addTransactions,
    getAccountDetails,
    getAllTransactions
};
