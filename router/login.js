const express = require('express');
require('express-async-error')
const router = express.Router();
const { logIn } = require('../controller/login');

router.get('/login',logIn)

module.exports = router