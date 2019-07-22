const redis = require('redis');

const client = redis.createClient();
// const client = redis.createClient(6379, 'redis');

module.exports.getAllRoomsInfo = (req, res) => {
  client.keys('*', (err, rooms) => {
    if (err) {
      res.status(500).json({
        message: 'fail',
      })
    }
    let data = [];
    rooms.forEach((room, index) => {
      client.llen(room, (err, len) => {
        if (err) {
          res.status(500).json({
            message: 'fail',
          })
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