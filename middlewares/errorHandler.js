const mongoose = require('mongoose');

const { CastError, ValidationError } = mongoose.Error;
const { ForbiddenErr } = require('../errors/ForbiddenError');
const { NotFoundErr } = require('../errors/NotFoundError');
const { UnathorizedErr } = require('../errors/UnathorizedError');
const {
  STATUS_CODE_BAD_REQUEST,
  STATUS_CODE_CONFLICT,
  INTERNAL_SERVER_ERROR,
} = require('../utils/constants');

const errorHandler = ((err, req, res, next) => {
  if (err.code === 11000) {
    return res.status(STATUS_CODE_CONFLICT).send({ message: 'Пользователь с этим e-mail уже существует' });
  }
  if (err instanceof ForbiddenErr || err instanceof NotFoundErr || err instanceof UnathorizedErr) {
    const { message } = err;
    return res.status(err.statusCode).send({ message });
  }
  if (err instanceof CastError || err instanceof ValidationError) {
    return res.status(STATUS_CODE_BAD_REQUEST).send({ message: 'Переданы неккоректные данные' });
  }
  res.status(INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
  return next();
});

module.exports = {
  errorHandler,
};
