import crypto from 'crypto';

import hasher from '../utils/hashing.js';
import utils from '../utils/utils.js';
import userDB from '../db/user.js';

const userSignUp = async ({
  firstName, lastName, email, password, dob
}) => {
  const salt = crypto.randomBytes(16).toString('hex');
  const hashedPassword = hasher.hash(utils.base64toString(password), salt);

  const user = {
    firstName,
    lastName,
    email,
    password: hashedPassword,
    dob,
    salt
  };

  return userDB.addUser(user);
};

export default {
  userSignUp
};
