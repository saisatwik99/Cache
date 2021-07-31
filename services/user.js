import crypto from 'crypto';

import hasher from '../utils/hashing.js';
import utils from '../utils/utils.js';
import userDB from '../db/user.js';
import InternalServerError from '../utils/errors/internalServerError.js';

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

  const { insertedId } = await userDB.addUser(user);
  const userId = insertedId.toString();
  if (!insertedId) {
    throw new InternalServerError('ID of User Not Found');
  }

  return utils.getToken(userId);
};

export default {
  userSignUp
};
