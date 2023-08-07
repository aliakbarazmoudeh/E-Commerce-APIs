const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
} = require('../controllers/userController');
const {
  authenicate,
  authorizePermission,
} = require('../middleware/authentication');

router.route('/').get(authenicate, authorizePermission('admin'), getAllUsers);
router.route('/show-me').get(authenicate, showCurrentUser);
router.route('/update-user').patch(authenicate, updateUser);
router.route('/update-user-password').post(authenicate, updateUserPassword);
router
  .route('/:id')
  .get(authenicate, authorizePermission('admin'), getSingleUser);

module.exports = router;
