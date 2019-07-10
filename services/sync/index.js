const app = require('express')();
const server = app.listen(8080, () => {
  const host = server.address().address;
  const port = server.address().port;

  console.log("Sync listening at http://%s:%s", host, port);
});

const io = require('socket.io')(server);

let curRoomList = {};

io.on('connection', (socket) => {
  let room;
  let displayName;
  console.log('A user connected');

  socket.on('join_room', (data) => {
    // join the connected client to the room
    room = data.room;
    displayName = data.displayName;
    let id = data.id;
    socket.join(room);

    // add the client to the "database"
    if (!curRoomList[room]) {
      curRoomList[room] = [{
        displayName: displayName,
        id: id
      }];
    } else {
      curRoomList[room].push({
        displayName: displayName,
        id: id
      });
    }

    // update the display table in each client in the room
    socket.nsp.to(room).emit(
      'update_nameList',
      { userList: curRoomList[room] }
    );

    console.log(curRoomList);
  });

  socket.on('get_status', (data) => {
    // sync with other users in the room when join
    if (curRoomList[room].length > 1) {
      targetSocketId = curRoomList[room][0].id;
      console.log(`targetSocketId:${targetSocketId}`);
      socket.nsp.connected[targetSocketId].emit('get_status', { id: data.id });
    }
  })

  socket.on('set_status', (data) => {
    console.log(`join user id:${data.id}`);
    socket.nsp.connected[data.id].emit('set_status', {
      playState: data.playState,
      currTime: data.currTime,
      videoId: data.videoId
    });
  })

  socket.on('pause_video', (data) => {
    console.log('video paused');
    socket.broadcast.to(room).emit('pause_video', { time: data.time });
  })

  socket.on('play_video', (data) => {
    console.log('video played');
    socket.broadcast.to(room).emit('play_video', { time: data.time });
  })

  socket.on('change_time', (data) => {
    console.log('time changed');
    socket.broadcast.to(room).emit('change_time', { time: data.time });
  })

  socket.on('disconnect', () => {
    console.log('A user disconnected');
    socket.leave(room);
    for (let i = 0; i < curRoomList[room].length; i++) {
      if (curRoomList[room][i].displayName === displayName) {
        curRoomList[room].splice(i, 1);
        i--;
      }
    }
    if (curRoomList[room].length === 0) {
      delete curRoomList[room];
    }
    socket.nsp.to(room).emit(
      'update_nameList',
      { userList: curRoomList[room] }
    );
    console.log(curRoomList);
  })
});
