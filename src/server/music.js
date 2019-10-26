const fs = require('fs');
const path = require('path');


function getMusicFiles() {
  return fs.readdirSync(path.resolve(process.cwd() + '/music')).filter(file => file.endsWith('.mp3'));
}

function getFileByVideoId(videoId) {
  return getMusicFiles().find(file => file.startsWith(videoId));
}

module.exports = {
  getFileByVideoId,
  getMusicFiles
};
