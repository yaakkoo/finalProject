const express = require('express');
require('express-async-error')
const router = express.Router();
const { Auth } = require('../middleware/middleware')
const { getUser, addUser, deleteUser, editRate, editWin, editLose, online, getUserName, image, availableFriends, getUserId, confirm, forgetPassword, setPassword, editPassword } = require('../controller/user')


router.get('/getUser', getUser);
router.get('/getUserName', getUserName);
router.get('/getUserId', getUserId)
router.post('/addUser', addUser);
router.post('/confirm' , confirm)
router.post('/editRate', Auth, editRate);
router.post('/editWin', Auth, editWin);
router.post('/editLose', Auth, editLose);
router.post('/editFriends', Auth, editRate);
router.post('/online', Auth, online);
router.delete('/deleteUser', Auth, deleteUser);
router.post('/image', Auth, image)
router.get('/availableFriends', Auth, availableFriends)
router.post('/forgetPassword' ,forgetPassword)
router.post('/setPassword/:id',setPassword)
router.post('/editPassword' , Auth , editPassword)

module.exports = router;