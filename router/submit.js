const express = require('express');
const { getStatus, getStatusUser, getMatchStatus, getMatchStatusPro } = require('../controller/submit');
require('express-async-error')
const router = express.Router();
const { Auth } = require('../middleware/middleware')

router.post('/getStatusUser', Auth, getStatusUser)
router.post('/getStatus', Auth, getStatus)
router.post('/getMatchStatus', Auth, getMatchStatus)
router.post('/getMatchStatusPro', Auth, getMatchStatusPro)

module.exports = router