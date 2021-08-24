const express = require('express');
require('express-async-error')
const router = express.Router();
const { Auth } = require('../middleware/middleware')
const { getUser, deleteUser, editRate, editWin, editLose, online, getUserName, image, availableFriends, getUserId, confirm, forgetPassword, setPassword, editPassword, signUp } = require('../controller/user')


router.get('/getUser', getUser);
router.post('/getUserName', getUserName);
router.post('/getUserId', getUserId)
router.post('/signUp', signUp);
router.post('/confirm' , confirm)
router.post('/editRate', Auth, editRate);
router.post('/editWin', Auth, editWin);
router.post('/editLose', Auth, editLose);
router.post('/editFriends', Auth, editRate);
router.post('/online', Auth, online);
router.post('/deleteUser', Auth, deleteUser);
router.post('/image', Auth, image)
router.post('/availableFriends', Auth, availableFriends)
router.post('/forgetPassword' ,forgetPassword)
router.post('/setPassword/:id',setPassword)
router.post('/editPassword',Auth  , editPassword)

module.exports = router;