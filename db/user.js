import db from './db.js';
import ConflictError from '../utils/errors/conflictError.js';
import {ObjectId} from 'mongodb';

const usersCollectionRef = () => db.get().collection('users');

const getUserDetails = ({email='', userId=''}) => {
  if (email === '' && userId !== '') {
    return usersCollectionRef().findOne({ _id: ObjectId(userId) });
  }
  if (userId === '' && email !== '') {
    return usersCollectionRef().findOne({ email });
  }
  if (userId !== '' && email !== '') {
    return usersCollectionRef().findOne({ email, _id: ObjectId(userId) });
  }
  return null;
};

const getUserDetailsUsingId = (id) => usersCollectionRef().findOne({ _id: ObjectId(id) });

const addUser = async (user) => {
  const isUserPresent = await usersCollectionRef().findOne({ email: user.email });
  if (isUserPresent) {
    throw new ConflictError('User Already Present');
  }
  return usersCollectionRef().insertOne(user);
};

export default {
  addUser,
  getUserDetails,
  getUserDetailsUsingId
};
