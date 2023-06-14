const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { ConflictRequestError } = require('../errors/ConflictRequestError');
const { BadRequestError } = require('../errors/BadRequestError');
const { NotFoundError } = require('../errors/NotFoundError');

const { JWT_SECRET, NODE_ENV } = process.env;

const createUser = (req, res, next) => {
  const {
    name,
    email,
    password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    .then(() => res.status(201).send({
      name,
      email,
    }))
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictRequestError('Пользователь с этим e-mail уже существует'));
        return;
      }
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы неккоректные данные'));
        return;
      }
      next();
    });
};

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        throw new NotFoundError('Пользователь не найден');
      }
    })
    .catch(next);
};

const updateUser = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      res.send(user);
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      res.send(token);
    })
    .catch(next);
};

module.exports = {
  createUser,
  getCurrentUser,
  updateUser,
  login,
};
