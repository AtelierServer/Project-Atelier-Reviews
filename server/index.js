require('dotenv').config();
const path = require('path');
const express = require('express');
const axios = require('axios');

const db = require('../database/index');

const app = express();
app.use(express.json());

app.get('/reviewsGetTest/', (req, res) => {
  db.get(req.query)
    .then((response) => {
      res.send(response);
    })
    .catch((err) => {
      console.error(err);
      res.send(err);
    });
});

app.post('/reviewsPostTest', (req, res) => {
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
  db.reviewsPost(params)
    .then((response) => {
      res.send(response);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send(err);
    });
});

app.use(express.static(path.join(__dirname, '../dist')));
// other configuration...

app.use('/*', (req, res, next) => {
  axios({
    method: req.method,
    url: `https://app-hrsei-api.herokuapp.com/api/fec2/hr-rfp${req.baseUrl}${req.url}`,
    headers: {
      Authorization: process.env.TOKEN,
      'Content-Type': 'application/json',
    },
    data: req.body,
  })
    .then((response) => {
      res.status(200).send(response.data);
      next();
    })
    .catch((err) => {
      res.status(500).send(err);
      next();
    });
});

app.listen(process.env.PORT, () => { });
