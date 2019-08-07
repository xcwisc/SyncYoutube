const redis = require('redis');
// const redisAdapter = require('socket.io-redis');

// const client = redis.createClient();
const client = redis.createClient(6379, 'redis');

module.exports.listen = (app) => {
  const io = require('socket.io').listen(app);
  // io.adapter(redisAdapter({
  //   host: 'localhost',
  //   port: 6379
  // }));

  io.on('connection', (socket) => {
    let room;
    let displayName;
    let id = socket.id;
    console.log('A user connected');

    socket.on('join_room', (data) => {
      // join the connected client to the room
      room = data.room;
      displayName = data.displayName;
      socket.join(room);

      // add the client to redis
      const user = `${id}.${displayName}`;
      client.rpush(room, user);

      // updateNameList
      updateNameList(room, socket);
    });

    socket.on('get_status', (data) => {
      // sync with other users in the room when join
      client.llen(room, (err, res) => {
        if (err) {
          return;
        }
        console.log(res);
        if (res > 1) {
          client.lindex(room, 0, (err, res) => {
            if (err) {
              return;
            }
            targetSocketId = res.split(".")[0];
            console.log(`targetSocketId:${targetSocketId}`);
            socket.nsp.connected[targetSocketId].emit('get_status', {
              id: data.id
            });
          });
        }
      });
    });

    socket.on('set_status', (data) => {
      console.log(`join user id:${data.id}`);
      socket.nsp.connected[data.id].emit('set_status', {
        playState: data.playState,
        currTime: data.currTime,
        videoId: data.videoId
      });
    });

    socket.on('pause_video', (data) => {
      console.log('video paused');
      socket.broadcast.to(room).emit('pause_video', {
        time: data.time
      });
    });

    socket.on('play_video', (data) => {
      console.log('video played');
      socket.broadcast.to(room).emit('play_video', {
        time: data.time
      });
    });

    socket.on('change_time', (data) => {
      console.log('time changed');
      socket.broadcast.to(room).emit('change_time', {
        time: data.time
      });
    });

    socket.on('change_video', (data) => {
      console.log('video changed');
      socket.broadcast.to(room).emit('change_video', {
        videoId: data.videoId
      });
    });

    socket.on('chat', (data) => {
      // console.log('chat message received');
      socket.broadcast.to(room).emit('chat', {
        message: data.message,
        displayName: data.displayName,
        emoji: data.emoji,
        selfSend: data.selfSend
      });
    });

    socket.on('disconnect', () => {
      console.log('A user disconnected');
      socket.leave(room);
      const user = `${id}.${displayName}`;
      client.lrem(room, 1, user);
      updateNameList(room, socket);
    });
  });
}

/**
 * update the display table in each client in the room
 * @param {string} room
 * @param {*} socket 
 */
const updateNameList = (room, socket) => {
  // console.log(`data in socket server${Object.keys(socket.nsp.connected)}`);
  client.lrange(room, 0, -1, (err, res) => {
    if (err) {
      return;
    }
    console.log(res);
    let userList = [];
    res.map((el) => {
      const parsed = el.split('.', 2);
      const id = parsed[0];
      const displayName = parsed[1];
      userList.push({
        displayName: displayName,
        id: id
      });
    });
    socket.nsp.to(room).emit(
      'update_nameList', {
        userList: userList
      }
    );
  })
};