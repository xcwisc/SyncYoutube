const http = require('http');
// const morgan = require('morgan');

http.globalAgent.maxSockets = 1024;
const app = require('express')();

const apiRoutes = require('./router');
// app.use(morgan('combined'));
// app.get('/api/v1', (req, res) => { res.send('hello') });
app.use('/api/v1', apiRoutes);

const server = http.Server(app);

const io = require('./lib/sockets').listen(server);

server.listen(8080, () => {
  const host = server.address().address;
  const port = server.address().port;

  console.log("Sync listening at http://%s:%s", host, port);
});

// app.listen(8080, (err) => {
//   console.log("Sync listening at %s", 8080);
// })