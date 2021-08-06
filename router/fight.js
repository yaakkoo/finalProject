const express = require('express')
const { Auth } = require('../middleware/middleware')
const { decline, accept, randomMatch, friendMatch, endFight, getMatchInfo } = require('../controller/fight')
require('express-async-error')

const router = express.Router()

router.post('/randomMatch', Auth, randomMatch)
router.post('/friendMatch', Auth, friendMatch)
router.post('/decline', Auth, decline)
router.post('/accept', Auth, accept)
router.post('/endFight', Auth, endFight)
router.get('/getMatchInfo' , getMatchInfo)
module.exports = router