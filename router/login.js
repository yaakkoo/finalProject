const express = require('express');
require('express-async-error')
const router = express.Router();
const { logIn } = require('../controller/login');

router.post('/login',logIn)

module.exports = router