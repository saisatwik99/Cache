import jwt from 'jsonwebtoken';

import InvalidJwtError from '../utils/errors/invalidToken.js';
import userDB from '../db/user.js';

const jwtConst = {
  issuer: 'fanta',
  expiresIn: process.env.NODE_ENV === 'staging' ? '4d' : '20m'
};

const envSecret = () => process.env.SECRET_KEY;

const base64toString = (b64) => Buffer.from(b64, 'base64').toString();

const getToken = (id) => jwt.sign({ id }, envSecret(), jwtConst);

const verifyAuthToken = async (req, res, next) => {
  const token = (req.headers.authorization && req.headers.authorization.split(' ')[1]) || '';

  const isVerified = jwt.verify(token, envSecret(), jwtConst);
  if (!isVerified) {
    return next(new InvalidJwtError('Invalid Token'));
  }
  const data = jwt.decode(token, jwtConst);
  const user = await userDB.getUserDetails({ userId: data.id });
  req.user = user;

  return next();
}

export default {
  base64toString,
  getToken,
  verifyAuthToken
};
