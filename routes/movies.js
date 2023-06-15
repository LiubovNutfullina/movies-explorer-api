const router = require('express').Router();
const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');
const {
  validateMovie,
  validateMovieById,
} = require('../utils/validate/movieValidate');

router.get('/movies', getMovies);
router.post('/movies', validateMovie, createMovie);
router.delete('/movies/_id', validateMovieById, deleteMovie);

module.exports = router;
