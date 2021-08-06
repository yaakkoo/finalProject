const express = require('express');
const { compile } = require('../controller/compile');
require('express-async-error')
const router = express.Router();

router.post('/submit', compile)

module.exports = router
