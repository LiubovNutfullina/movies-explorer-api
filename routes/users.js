const router = require('express').Router();
const {
  getCurrentUser,
  updateUser,
} = require('../controllers/users');
const {
  validateUpdateUser,
} = require('../utils/validate/userValidate');

router.get('/users/me', getCurrentUser);
router.patch('/users/me', validateUpdateUser, updateUser);

module.exports = router;
