const router = require('express').Router();
const {
  getCurrentUser,
  updateUser,
} = require('../controllers/users');
const {
  validateUpdateUser,
} = require('../middlewares/userValidate');

router.get('/users/me', getCurrentUser);
router.patch('/users/me', validateUpdateUser, updateUser);

module.exports = router;
