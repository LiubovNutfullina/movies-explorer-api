const router = require('express').Router();
const userRouter = require('./users');
const movieRouter = require('./movies');
const { login, createUser } = require('../controllers/users');
const auth = require('../middlewares/auth');
const { validateLogin, validateUser } = require('../middlewares/userValidate');
const { NotFoundError } = require('../errors/NotFoundError');

router.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

router.post('/signin', validateLogin, login);
router.post('/signup', validateUser, createUser);

router.use(auth);

router.use(userRouter, movieRouter);

router.all('/*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

module.exports = router;
