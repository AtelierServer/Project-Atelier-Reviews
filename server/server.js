require('dotenv').config();
const express = require('express');
const path = require('path');
const axios = require('axios');
const morgan = require('morgan');
const cloudinary = require('cloudinary').v2;
const compression = require('compression');
const config = require('../config.js');

const db = require('../database/index');

const auth = `${config.GITHUB_APIKEY}`;
const app = express();

app.use(compression());
app.use(express.json({ limit: '50mb' }));
app.use(express.static(path.join(__dirname, '../dist')));
app.use(morgan('dev'));

// Add authorization API key, pass requests to API with axios and return responses to client
app.all('/api/*', (req, res) => {
  console.log('API request received: ', req.method, ' to url ', req.originalUrl);
  axios({
    method: req.method,
    url: req.originalUrl.slice(4),
    baseURL: 'https://app-hrsei-api.herokuapp.com/api/fec2/hr-rfp/',
    headers: { Authorization: auth },
    data: req.body,
  }).then((response) => {
    res.status(response.status).json(response.data);
    console.log('API call successful, status: ', response.status);
  }).catch((err) => {
    res.status(500).json({ message: err });
    if (err.response) {
      console.log('Error received from API: ', err.response.status, '\n Data: ', err.response.data, '\n Headers: ', err.response.headers);
    } else if (err.request) {
      console.log('Error, request made no response received: ', err.request);
    } else {
      console.log('Error, no request sent: ', err.message);
    }
  });
});

app.get('/reviewGetTest', (req, res) => {
  db.getAll()
    .then((response) => {
      res.send(response);
    })
    .catch((err) => {
      console.error(err);
    });
});

app.post('/reviewPostTest', (req, res) => {
  // console.log(req.body, 'req body');
  // write reviews into reviews
  const params = [
    req.body.product_id,
    req.body.rating,
    Number(req.body.date),
    req.body.summary,
    req.body.body,
    req.body.recommend,
    req.body.name,
    req.body.email,
  ];
  // write photos into photos
  // const params = [req.body]
  db.post(params)
    .then((response) => {
      res.send(response);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send(err);
    });
});

// REFACTOR THIS, SO THAT I CAN MAKE REQUESTS TO DATABASE
// set up routes to API
//    export db connection
//    something like... db.get =
// create API. i.e., when database gets a request, return this query.

// Make cloudinary API request to upload photo and return url from response to client
app.post('/photos', (req, res) => {
  console.log('Photos post request received to url ', req.originalUrl);
  const fileURL = req.body.url;
  cloudinary.uploader.upload(fileURL, { format: 'jpg' })
    .then((response) => {
      res.status(200).json(response.secure_url);
    })
    .catch((err) => {
      res.status(500).send('Error posting photo to server');
      if (err.response) {
        console.log('Error received from API: ', err.response.status, '\n Data: ', err.response.data, '\n Headers: ', err.response.headers);
      } else if (err.request) {
        console.log('Error, request made no response received: ', err.request);
      } else {
        console.log('Error, no request sent: ', err);
      }
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening at port: ${PORT}`);
});
