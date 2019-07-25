const express = require('express');
const ctrlRooms = require('../controllers');

const router = express.Router();

router.get('/', ctrlRooms.getAllRoomsInfo);
router.get('/:room', ctrlRooms.getRoomInfo);


module.exports = router;