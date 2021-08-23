const express = require('express');
const { addFriend, deleteFriend, acceptFriend, others } = require('../controller/friend');
const { Auth } = require('../middleware/middleware');
require('express-async-error')
const router = express.Router();

router.post('/addFriend',Auth , addFriend)
router.post('/deleteFriend',Auth , deleteFriend)
router.post('/acceptFriend',Auth , acceptFriend)
router.post('/others',others)

module.exports = router