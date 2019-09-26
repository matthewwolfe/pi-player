const express = require('express');
const path = require('path');
const ws = require('ws');


function start() {
  const server = express();
  var socket = null;
  var queue = [];

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
      queue.push(videoId);
      socket.send(JSON.stringify({type: 'ADD', videoId: videoId}));
      res.json({message: 'Successfully added song to the queue'});
      console.log('song added to queue');
    }
    else {
      res.json({message: 'Unable to add song to the queue'});
      console.log('unable to add song to queue');
    }
  });

  server.listen(3000, () => {
    console.log('server listening on port 3000');
  });

  const wss = new ws.Server({port: 3001});

  wss.on('connection', (websocket) => {
    socket = websocket;
    console.log('connected');

    if (queue.length > 0) {
      queue.forEach(videoId => websocket.send(JSON.stringify({type: 'ADD', videoId: videoId})));
    }

    websocket.on('message', (message) => {
      message = JSON.parse(message);

      switch (message.type) {
        case 'REMOVE': {
          queue.splice(message.index, 1);
          console.log(`song removed from queue at index: ${message.index}`);
          console.log(`there are now ${queue.length} songs in the queue`);
        }
      }
    });
  });
}

module.exports = {
  start
};
