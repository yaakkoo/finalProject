const express = require('express');
const { getStatus, getStatusUser, getMatchStatus, getMatchStatusPro } = require('../controller/submit');
require('express-async-error')
const router = express.Router();
const { Auth } = require('../middleware/middleware')

router.get('/getStatusUser', Auth, getStatusUser)
router.get('/getStatus', Auth, getStatus)
router.get('/getStatus', Auth, getMatchStatus)
router.get('/getStatus', Auth, getMatchStatusPro)

module.exports = router