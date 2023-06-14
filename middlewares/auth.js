const jwt = require('jsonwebtoken');
const { UnathorizedError } = require('../errors/UnathorizedError');

const { JWT_SECRET, NODE_ENV } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new UnathorizedError('Необходима авторизация'));
  }
  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    return next(new UnathorizedError('Необходима авторизация'));
  }
  req.user = payload;
  return next();
};
