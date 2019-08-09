const redis = require('redis');

// const client = redis.createClient();
const client = redis.createClient(6379, 'redis');

/**
 * List out all the rooms
 */
module.exports.getAllRoomsInfo = (req, res) => {
  client.keys('roomId.*', (err, rooms) => {
    if (err) {
      res.status(500).json({
        message: 'fail',
      });
      return;
    }
    let data = [];
    if (rooms.length === 0) {
      res.status(200).json({
        message: 'success',
        data: data
      })
      return;
    }
    rooms.forEach((room, index) => {
      client.llen(room, (err, len) => {
        if (err) {
          res.status(500).json({
            message: 'fail',
          });
          return;
        }
        let roomInfo = {};
        roomInfo[room] = len;
        data.push(roomInfo);
        if (index === rooms.length - 1) {
          res.status(200).json({
            message: 'success',
            data: data
          })
        }
      })
    })
  })
};

/**
 * List out a single room's info
 */
module.exports.getRoomInfo = (req, res) => {
  let room = req.params.room;
  room = `roomId.${room}`;
  client.llen(room, (err, len) => {
    if (err) {
      res.status(404).json({
        message: 'room not found',
      });
      return;
    }
    res.status(200).json({
      message: 'success',
      data: {
        len: len,
      },
    });
  })
}

/**
 * Change the passWord of a room
 */
module.exports.setRoomPassword = (req, res) => {
  let room = req.params.room;
  room = `roomPassword.${room}`;
  const password = req.body.password;
  client.set(room, password, (err, reply) => {
    if (err) {
      res.status(500).json({
        message: 'fail',
      });
      return;
    }
    if (reply === "OK") {
      res.status(200).json({
        message: 'success',
      });
      return;
    }
  });
}

/**
 * Varify if a room currently has a password
 */
module.exports.roomHasPassword = (req, res) => {
  let room = req.params.room;
  room = `roomPassword.${room}`;
  client.get(room, (err, reply) => {
    if (err) {
      res.status(500).json({
        message: 'fail',
      });
      return;
    }
    let reponseObj = {
      message: 'success',
      data: {
        hasPassword: true
      }
    }
    if (reply === null) {
      reponseObj.data.hasPassword = false;
    }
    res.status(200).json(reponseObj);
  });
}

/**
 * Check the provided password againt the real password
 */
module.exports.roomLogin = (req, res) => {
  let room = req.params.room;
  room = `roomPassword.${room}`;
  const password = req.body.password;
  client.get(room, (err, reply) => {
    if (err) {
      res.status(500).json({
        message: 'fail',
      });
      return;
    }
    let reponseObj = {
      message: 'success',
      data: {
        logedIn: false
      }
    }
    if (password === reply) {
      reponseObj.data.logedIn = true;
    }
    res.status(200).json(reponseObj);
  });
}