require('dotenv').config();
const { Client } = require('pg');

const getAll = () => new Promise((resolve, reject) => {
  const client = new Client();
  client.connect()
    .then(() => {
      console.log('connected');
    })
    .then(() => client.query('SELECT * FROM reviews LIMIT 175'))
    .then((result) => {
      resolve(result.rows);
    })
    .catch((err) => {
      console.log('FAT ERROR');
      console.error(err.message);
      console.error(err.stack);
      reject(err);
    })
    .finally(() => {
      client.end();
    });
});

const post = (params) => new Promise((resolve, reject) => {
  console.log(params, 'this is PARAMS')
  const client = new Client();
  client.connect()
    .then(() => client.query("INSERT INTO reviews (product_id, rating, date, summary, body, recommend, reviewer_name, reviewer_email) VALUES ($1, $2, to_timestamp($3 / 1000) AT TIME ZONE 'UTC', $4, $5, $6, $7, $8)", params))
    .then((result) => {
      resolve(result);
    })
    .catch((err) => {
      reject(err);
    });
    // other code for photos, characteristics
});

module.exports = { getAll, post };
