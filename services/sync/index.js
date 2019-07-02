const app = require('express')();
// app.get('/sync', (req, res) => {
//   res.send('sanity check')
// })
const server = app.listen(8080, () => {
  const host = server.address().address;
  const port = server.address().port;

  console.log("Sync listening at http://%s:%s", host, port);
});

const io = require('socket.io')(server);

let curRoomList = {};

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('join_room', (room) => {
    socket.join(room);
    if (!roomExist(room, curRoomList)) {
      curRoomList[room] = 1;
    } else {
      ++curRoomList[room];
    }
  });

  socket.on('pause_video', (data) => {
    // console.log('message received');
    console.log('video paused');
    socket.broadcast.to(data.room).emit('pause_video', { time: data.time });
  })

  socket.on('play_video', (data) => {
    // console.log('message received');
    console.log('video played');
    socket.broadcast.to(data.room).emit('play_video', { time: data.time });
  })

  socket.on('change_time', (data) => {
    console.log('time changed');
    socket.broadcast.to(data.room).emit('change_time', { time: data.time });
  })

  socket.on('leave_room', (data) => {
    console/log('A user has left a room');
    socket.leave(data.room);
    curRoomList[data.room]--;
    if (curRoomList[data.room] === 0) {
      delete test['blue'];
    }
  })

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  })
});
