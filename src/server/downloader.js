const { exec } = require('child_process');

function download(videoId) {
  return new Promise((resolve, reject) => {
    const url = `http://www.youtube.com/watch?v=${videoId}`;
    const command = `youtube-dl --output './music/${videoId} - %(title)s.%(ext)s' --extract-audio --audio-format mp3 ${url}`;

    exec(command, (err, stdout, stderr) => {
      if (err) {
        // node couldn't execute the command
        reject();
      }

      resolve({stdout, stderr});
    });
  });
}

module.exports = {
  download
};
