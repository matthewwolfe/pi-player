const { exec } = require('child_process');
const express = require('express');
const fs = require('fs');
const path = require('path');
const ws = require('ws');


function start() {
  const server = express();
  var socket = null;
  var queue = [];

  server.use(express.urlencoded({ extended: true }));
  server.use(express.json());

  server.get('/*.js', (req, res) => {
    res.sendFile(path.resolve(__dirname + `/../../dist/${req.originalUrl.replace('/', '')}`));
  });

  server.get('/*.css', (req, res) => {
    res.sendFile(path.resolve(__dirname + `/../../public/css/${req.originalUrl.replace('/', '')}`));

  });

  server.get('/search', (req, res) => {
    res.sendFile(path.resolve(__dirname + '/../../public/search.html'));
  });

  server.get('/*', (req, res) => {
    res.sendFile(path.resolve(__dirname + '/../../public/queue.html'));
  });

  server.post('/add', (req, res) => {
    const videoId = req.body.videoId;

    console.log(req.body);

    if (socket && videoId) {
      downloadMp3(videoId);
      queue.push(videoId);

      socket.send(JSON.stringify({type: 'ADD', videoId: videoId}));
      res.json({message: 'Successfully added song to the queue'});
      console.log(`song added to queue with id: ${videoId}`);
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

function downloadMp3(videoId) {
  const url = `http://www.youtube.com/watch?v=${videoId}`;

  exec(`youtube-dl --output './music/${videoId} - %(title)s.%(ext)s' --extract-audio --audio-format mp3 ${url}`, (err, stdout, stderr) => {
    if (err) {
      // node couldn't execute the command
      return;
    }

    // the *entire* stdout and stderr (buffered)
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
  });
}

module.exports = {
  start
};
