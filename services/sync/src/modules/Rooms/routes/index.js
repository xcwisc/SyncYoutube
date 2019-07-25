const express = require('express');
const ctrlRooms = require('../controllers');

const router = express.Router();

router.get('/', ctrlRooms.getAllRoomsInfo);


module.exports = router;