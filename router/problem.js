const express = require('express');
const { addProblem, getProblemCode, getProblem } = require('../controller/problem');
require('express-async-error')
const router = express.Router();

router.post('/addProblem' , addProblem)
router.get('/getProblem' , getProblem)
router.post('/getProblemCode' , getProblemCode)

module.exports = router