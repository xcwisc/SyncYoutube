const redis = require('redis');

const client = redis.createClient();
// const client = redis.createClient(6379, 'redis');

module.exports.getAllRoomsInfo = (req, res) => {
  client.keys('*', (err, rooms) => {
    if (err) {
      res.status(500).json({
        message: 'fail',
      });
      return;
    }
    let data = [];
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

module.exports.getRoomInfo = (req, res) => {
  let room = req.params.room;
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