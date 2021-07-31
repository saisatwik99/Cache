import db from './db.js';

const usersCollectionRef = () => db.get().collection('users');

const addUser = (user) => usersCollectionRef().insertOne(user);

export default {
  addUser
};
