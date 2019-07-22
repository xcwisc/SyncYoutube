const http = require('http');

http.globalAgent.maxSockets = 1024;

const app = require('express')();

const server = http.Server(app);
const io = require('./lib/sockets').listen(server);

const apiRoutes = require('./router');

app.use('/api/v1', apiRoutes);

server.listen(8080, () => {
  const host = server.address().address;
  const port = server.address().port;

  console.log("Sync listening at http://%s:%s", host, port);
});