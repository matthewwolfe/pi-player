const express = require('express');
const path = require('path');
const ws = require('ws');


function start() {
  const server = express();
  var socket = null;

  server.use(express.urlencoded());

  server.get('/bundle.js', (req, res) => {
    res.sendFile(path.resolve(__dirname + '/../../dist/bundle.js'));
  });

  server.get('/bundle.css', (req, res) => {
    res.sendFile(path.resolve(__dirname + '/../../public/css/bundle.css'));
  });

  server.get('/*', (req, res) => {
    res.sendFile(path.resolve(__dirname + '/../../public/index.html'));
  })

  server.post('/add', (req, res) => {
    const videoId = req.body.videoId;

    if (socket) {
      socket.send(JSON.stringify({type: 'ADD', videoId: videoId}));
      res.json({message: 'Successfully added song to the queue'});
    }
    else {
      res.json({message: 'Unabke to add song to the queue'});
    }
  });

  server.listen(3000, () => {
    console.log('server listening on port 3000');
  });

  const wss = new ws.Server({port: 3001});

  wss.on('connection', (websocket) => {
    socket = websocket;
    console.log('connected');
  })
}

module.exports = {
  start
};
