const express = require('express');
require('express-async-error')
const router = express.Router();
const { Auth } = require('../middleware/middleware')
const { getUser, editRate, editWin, editLose, online, getUserName, image, availableFriends, getUserId, confirm, forgetPassword, setPassword, editPassword, signUp, search, confirmCodePass } = require('../controller/user')


router.get('/getUser', getUser);
router.post('/getUserName', getUserName);
router.post('/getUserId', getUserId)
router.post('/signUp', signUp);
router.post('/confirm', confirm)
router.post('/editRate', Auth, editRate);
router.post('/editWin', Auth, editWin);
router.post('/editLose', Auth, editLose);
router.post('/online', Auth, online);
router.post('/image', Auth, image)
router.post('/availableFriends', Auth, availableFriends)
router.post('/forgetPassword', forgetPassword)
router.post('/setPassword', setPassword)
router.post('/confirmCodePass', confirmCodePass)
router.post('/editPassword', Auth, editPassword)
router.post('/search', search)

module.exports = router;