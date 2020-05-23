const express = require('express');
const router = express.Router();

const usercontroller = require('../controllers/users');

router.post('/signup',usercontroller.signup);

router.post('/login',usercontroller.login);

router.delete('/:userid',usercontroller.delete);

module.exports = router;