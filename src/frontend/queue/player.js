var player;
var socket;

const queue = [];

function onYouTubeIframeAPIReady() {
  initializeApp();
}

function initializeApp() {
  socket = new WebSocket(`ws://${window.location.hostname}:3001`);

  socket.onmessage = (message) => {
    message = JSON.parse(message.data);

    switch (message.type) {
      case 'ADD': {
        const { fileName, videoId } = message;
        queue.push(videoId);
        console.log(`song added with videoId: ${videoId}, fileName: ${fileName}`);

        renderQueue();

        if (!player) {
          initializePlayer();
        }
      }
    }
  };

  function initializePlayer() {
    if (queue.length > 0) {
      player = new YT.Player('player', {
        height: '390',
        width: '640',
        videoId: queue[0],
        events: {
          'onReady': onPlayerReady,
          'onStateChange': onPlayerStateChange
        }
      });
    }
  }
}

function onPlayerReady(event) {
  event.target.playVideo();
  renderQueue();
}

function onPlayerStateChange(event) {
  if (event.data === YT.PlayerState.ENDED) {
    playNext();
  }
}

function playNext() {
  queue.shift();

  if (socket) {
    socket.send(JSON.stringify({type: 'REMOVE', index: 0}));
  }

  if (queue.length) {
    player.loadVideoById(queue[0], 0, 'large');
  }

  renderQueue();
}

function pause() {

}

function renderQueue() {
  const songs = queue.length - 1;

  if (songs === -1) {
    return;
  }

  const el = document.getElementById('queue');
  el.innerHTML = `<h1>${songs} song${songs !== 1 ? 's' : ''} in the queue</h1>`;
}

function stop() {
  player.stopVideo();
}
