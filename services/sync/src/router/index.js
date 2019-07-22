const express = require('express');
const roomsRoutes = require('../modules/Rooms/routes');

const router = express.Router();

router.use('/rooms', roomsRoutes);

module.exports = router;