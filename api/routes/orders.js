const express = require('express');
const router = express.Router();
const checkauth = require('../middleware/chechauth');

const ordercontrollers = require('../controllers/orders');

router.get('/',checkauth,ordercontrollers.get_all);

router.post('/',checkauth,ordercontrollers.post_all);

router.get('/:orderID',checkauth,ordercontrollers.get_one);

router.delete('/:orderID',checkauth,ordercontrollers.delete_one);

module.exports = router;