const express = require('express');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const bodyParser = require('body-parser');

const PORT = process.env.PORT || process.env.API_PORT;

const app = express();

app.use(bodyParser.json({ limit: '500mb' }));

app.use(express.json());
app.use(cors());

app.route('/').get((req, res) => {
  res.send('Hi');
});

app.get('/proxy', (req, res) => {
  const url = req.query.url;
  if (!url) {
    return res.status(400).send('URL is required');
  }

  request
    .get(url)
    .on('error', (err) => {
      res.status(500).send(err.message);
    })
    .pipe(res);
});

const server = http.createServer(app);
// socketServer.registerSocketServer(server);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    server.listen(PORT, () => {
      console.log('Server running on port:', PORT);
    });
  })
  .catch((err) => {
    console.log('Database connection failed with error:', err);
  });
