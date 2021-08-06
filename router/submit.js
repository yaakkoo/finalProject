const express = require('express');
const {getStatus,  getStatusUser } = require('../controller/submit');
require('express-async-error')
const router = express.Router();

router.get('/getStatusUser' , getStatusUser)
router.get('/getStatus' , getStatus)

module.exports = router