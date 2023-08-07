const express = require('express');
const router = express.Router();
const { logIn, logOut, register } = require('../controllers/authController');

router.route('/register').post(register);
router.route('/login').post(logIn);
router.route('/logout').get(logOut);

module.exports = router
