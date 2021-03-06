// import your node modules
const express = require('express');
const db = require('./data/db.js');

const server = express();

// middleware
server.use(express.json());

// add your server code starting here

server.get('/', (req, res) => {
  res.json({ api: 'Running...' });
});

server.post('/api/post', (req, res) => { // POST Endpoint
  const posts = req.body;

  db
    .insert(posts)
    .then(response => {
      res.status(201).json(response);
    })
    .catch(error => {
      res.status(500)
      .json(error);
    }); 
});

server.get('/api/posts', (req, res) => { // GET Endpoint
  db
    .find()
    .then(posts => {
      res.json(posts);
    })
    .catch(error => {
      res.status(500).json({ error: "The posts information could not be retrieved." });
    });
});

server.get('/api/posts/search', (req, res) => { // GET Search Endpoint
  const { postid } = req.query;

  db
    .findById(postid)
    .then(posts => {
      res.json(posts[0]);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

server.get('/api/posts/:id', (req, res) => { // GET ID Endpoint
  const { id } = req.params;

  db
    .findById(id)
    .then(posts => {
      res.json(posts[0]);
    })
    .catch(error => {
      res.status(500).json({ error: "The post information could not be retrieved." });
    })
    .catch(error => {
      res.status(404).json({ message: "The post with the specified ID does not exist." })
    });
});

server.delete('/api/posts/:id', (req, res) => { // DELETE Endpoint
  const { id } = req.params;
  let post;

  db.findById(id)
    .then(response => {
      post = { ...response[0] };

  db
    .remove(id)
    .then(response => {
      res.status(200).json(post);
    })
    .catch(error => {
      res.status(500).json(error);
    });
  })
  .catch(error => {
    res.status(500).json(error);
  });
});

server.put('/api/posts/:id', (req, res) => { // PUT Endpoint
  const { id } = req.params;
  const update = req.body;

  db
    .update(id, update)
    .then (count => {
      if (count > 0) {
        db.findById(id).then(updateUser => {
          res.status(200).json(updatedUser);
        });
      } else {
        res
          .status(404)
          .json({ message: 'The post with the specified ID does not exist' });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

const port = 5000;
server.listen(port, () => console.log('API Running on port 5000'));