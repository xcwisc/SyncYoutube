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

  // socket.on('join room', (room) => {
  //   socket.join(room);
  //   if (!roomExist(room, curRoomList)) {
  //     curRoomList[room] = 1;
  //   } else {
  //     ++curRoomList[room];
  //   }
  // });

  socket.on('pause_video', (data) => {
    // console.log('message received');
    console.log('video paused');
    socket.broadcast.emit('pause_video', { time: data.time });
  })

  socket.on('play_video', (data) => {
    // console.log('message received');
    console.log('video played');
    socket.broadcast.emit('play_video', { time: data.time });
  })

  socket.on('change_time', (data) => {
    console.log('time changed');
    socket.broadcast.emit('change_time', { time: data.time });
  })

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  })
});
