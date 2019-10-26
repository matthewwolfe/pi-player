const express = require('express');
const fs = require('fs');
const path = require('path');
const ws = require('ws');
const downloader = require('./downloader');
const music = require('./music');
const router = require('./router');


function start() {
  const server = express();
  var socket = null;
  var queue = [];

  server.use(express.urlencoded({ extended: true }));
  server.use(express.json());
  router.addStaticRoutes(server);

  server.post('/add', (req, res) => {
    const videoId = req.body.videoId;

    console.log(req.body);

    if (socket && videoId) {
      downloader.download(videoId).then(() => {
        const fileName = music.getFileByVideoId(videoId);

        console.log(fileName);

        if (fileName) {
          queue.push(videoId);

          socket.send(JSON.stringify({type: 'ADD', videoId: videoId, fileName: fileName}));
          res.json({message: 'Successfully added song to the queue'});
          console.log(`song added to queue with id: ${videoId}`);
        }
      });
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
      queue.forEach(videoId => {
        const fileName = music.getFileByVideoId(videoId);

        if (fileName) {

        }
        websocket.send(JSON.stringify({type: 'ADD', fileName: fileName, videoId: videoId}));
      });
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
