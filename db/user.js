import db from './db.js';
import ConflictError from '../utils/errors/conflictError.js';

const usersCollectionRef = () => db.get().collection('users');

const getUserDetails = ({email='', userId=''}) => {
  if (email === '' && userId !== '') {
    return usersCollectionRef().findOne({ userId });
  }
  if (userId === '' && email !== '') {
    return usersCollectionRef().findOne({ email });
  }
  if (userId !== '' && email !== '') {
    return usersCollectionRef().findOne({ email, userId });
  }
  return null;
};

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
