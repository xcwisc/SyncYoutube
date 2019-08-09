const express = require('express');
const ctrlRooms = require('../controllers');

const router = express.Router();

router.get('/', ctrlRooms.getAllRoomsInfo);
router.get('/:room', ctrlRooms.getRoomInfo);
router.post('/password/:room', ctrlRooms.setRoomPassword);
router.get('/password/:room', ctrlRooms.roomHasPassword);
router.post('/login/:room', ctrlRooms.roomLogin)

module.exports = router;