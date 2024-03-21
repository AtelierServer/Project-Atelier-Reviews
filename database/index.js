require('dotenv').config();
const { Client } = require('pg');

const client = new Client();

client.connect()
  .then(() => {
    console.log('connected');
  })
  .then(() => client.query('CREATE DATABASE productsdb'))
  .catch(() => {
    console.log('dbalreadyexists');
  })
  .then(() => client.query('SELECT * FROM reviews LIMIT 10'))
  .then((result) => {
    console.log(result.rows, 'result');
  })
  .catch((err) => {
    console.log('FAT ERROR');
    console.error(err.message);
    console.error(err.stack);
  })
  .finally(() => {
    client.end();
  });
