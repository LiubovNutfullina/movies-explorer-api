const Movie = require('../models/movie');

const { ForbiddenError } = require('../errors/ForbiddenError');
const { NotFoundError } = require('../errors/NotFoundError');
const { BadRequestError } = require('../errors/BadRequestError');

const getMovies = (req, res, next) => {
  const owner = req.user._id;
  Movie.find({ owner })
    .populate(['owner', 'user'])
    .then((movies) => res.send(movies))
    .catch(next);
};

const createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner: {
      _id: req.user._id,
    },
  })
    .then((movie) => movie.populate('owner'))
    .then((movie) => res.status(201).send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы неккоректные данные'));
        return;
      }
      next();
    });
};

const deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Фильм не найден');
      }
      if (movie.owner._id.toString() !== req.user._id.toString()) {
        throw new ForbiddenError('Вы можете удалить только сохраненный у себя фильм');
      }
      return movie.deleteOne()
        .then(() => res.send({ message: 'Карточка удалена' }));
    })
    .catch(next);
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
