const Movie = require('../models/movie');

const { ForbiddenErr } = require('../errors/ForbiddenError');
const { NotFoundErr } = require('../errors/NotFoundError');

const getMovies = (req, res, next) => {
  const owner = req.user._id;
  Movie.find({ owner })
    .populate([{ path: 'owner', model: 'user' }])
    .then((cards) => res.send(cards))
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
    .catch(next);
};

const deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundErr('Фильм не найден');
      }
      if (movie.owner._id.toString() !== req.user._id.toString()) {
        throw new ForbiddenErr('Вы можете удалить только сохраненный у себя фильм');
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
