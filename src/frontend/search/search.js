const searchInput = document.getElementById('search-input');

searchInput.addEventListener('keypress', function (e) {
  const key = e.which || e.keyCode;
  const { value } = e.target;

  if (key === 13 && value.length > 0) {
    search(value);
  }
});

function addToQueue(videoId) {
  axios.post('http://localhost:3000/add', {
    videoId: videoId
  });
}

function search(query) {
  axios.get('https://www.googleapis.com/youtube/v3/search', {
    params: {
      part: 'snippet',
      q: query,
      key: 'YOUTUBE_API_KEY'
    }
  })
    .then(({data, status}) => {
      if (status === 200) {

        renderResults(data.items);
      }
    });
}

function renderResults(items) {
  const element = document.getElementById('results');
  element.innerHTML = '';

  items.forEach(({snippet: {title}, id: {videoId}}) => {
    const newElement = document.createElement('div');
    newElement.id = videoId;
    newElement.className = 'result';
    const titleElement = document.createTextNode(title);

    newElement.addEventListener("click", ({target: {id}}) => {
      addToQueue(id);
    });

    newElement.appendChild(titleElement);
    element.appendChild(newElement);
  });
}
