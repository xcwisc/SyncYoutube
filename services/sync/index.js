const app = require('express')();
const io = require('socket.io')(app);

let curRoomList = {};

io.of('/sync').on('connection', (socket) => {
  socket.on('join room', (room) => {
    socket.join(room);
    if (!roomExist(room, curRoomList)) {
      curRoomList[room] = 1;
    } else {
      ++curRoomList[room];
    }
  });

  socket.on('disconnect', () => {

  })
});

const server = app.listen(process.env.SYNC_SERVICE_URL | 8080, () => {
  const host = server.address().address;
  const port = server.address().port;

  console.log("Sync listening at http://%s:%s", host, port);
});