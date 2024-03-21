require('dotenv').config();
const { Client } = require('pg');
const fs = require('fs');
const copyFrom = require('pg-copy-streams').from;

const client = new Client();

client.connect()
  .then(() => {
    console.log('connected');
  })
  .then(() => client.query('CREATE DATABASE productsDB'))
  .catch(() => {
    console.log('dbalreadyexists');
  })
  .then(() => client.query('CREATE TABLE IF NOT EXISTS products ( id INT, name VARCHAR(255), slogan TEXT, description TEXT, category VARCHAR(255), default_price INT)'))
  .then(() => client.query('SELECT * FROM products'))
  .then((result) => {
    console.log(result.rows, 'result');
  })
  .then(() => {
    client.query("\copy products(id, name, slogan, description, category, default_price) FROM '/Users/amarinsam/Documents/Code/Hack Reactor/SDC_PROJECT-ATELIER/Project-Atelier-Reviews/database/data/productsFiltered.csv' WITH (FORMAT csv)");
  })
  .catch((err) => {
    console.log('FAT ERROR');
    console.error(err.message);
    console.error(err.stack);
  })
  .finally(() => {
    client.end();
  });
