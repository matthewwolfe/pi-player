const path = require('path');


function addStaticRoutes(server) {
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
}

module.exports = {
  addStaticRoutes
};
