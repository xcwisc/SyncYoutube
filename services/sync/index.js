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

io.of('/sync').on('connection', (socket) => {
  console.log('A user connected');

  // socket.on('join room', (room) => {
  //   socket.join(room);
  //   if (!roomExist(room, curRoomList)) {
  //     curRoomList[room] = 1;
  //   } else {
  //     ++curRoomList[room];
  //   }
  // });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  })
});
