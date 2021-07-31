import jwt from 'jsonwebtoken';

const jwtConst =  {
  issuer: 'fanta',
  expiresIn: process.env.NODE_ENV === 'staging' ? '4d' : '20m'
};

const envSecret = () => process.env.SECRET_KEY;

const base64toString = (b64) => Buffer.from(b64, 'base64').toString();

const getToken = (id) => jwt.sign({ id }, envSecret(), jwtConst);

export default {
  base64toString,
  getToken
};
