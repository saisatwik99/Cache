import db from './db.js';
import ConflictError from '../utils/errors/conflictError.js';

const usersCollectionRef = () => db.get().collection('users');

const getUserDetails = (email) => usersCollectionRef().findOne({ email });

const addUser = async (user) => {
  const isUserPresent = await usersCollectionRef().findOne({ email: user.email });
  if (isUserPresent) {
    throw new ConflictError('User Already Present');
  }
  return usersCollectionRef().insertOne(user);
};

export default {
  addUser,
  getUserDetails
};
