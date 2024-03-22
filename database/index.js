require('dotenv').config();
const { Client } = require('pg');

const get = (queryParams) => {
  return new Promise((resolve, reject) => {
    const client = new Client();
    client.connect()
      .then(() => {
        let pageQueryStr = '';
        let countQueryStr = '';
        let sortQueryStr = '';
        let product_idQueryStr = '';

        if (!queryParams.product_id) {
          const error = new Error('No query parameters provided')
          error.code = 'ERR_BAD_REQUEST';
          error.status = 422;
          reject(error);
          return;
        }

        product_idQueryStr = `WHERE product_id = ${queryParams.product_id}`;

        if (queryParams.count) {
          countQueryStr = `LIMIT ${queryParams.count}`
        } else {
          countQueryStr = 'LIMIT 5'
        }
        if (queryParams.sort === 'newest') {
          sortQueryStr = 'ORDER BY date DESC'
        } else if (queryParams.sort === 'helpfulness') {
          sortQueryStr = 'ORDER BY helpfulness DESC'
        } else {
          sortQueryStr = 'ORDER BY date DESC'
        }

        const queryStr = 'SELECT * FROM reviews ' + product_idQueryStr + ' ' + countQueryStr + ';';
        console.log(queryStr, 'querystr')
        return client.query(queryStr)
        // if (queryParams.page) {
        //   // page takes into account if count exists
        // }



      })
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
  })
};

const reviewsPost = (params) => new Promise((resolve, reject) => {
  console.log(params, 'this is PARAMS')
  const client = new Client();
  client.connect()
    .then(() => client.query("INSERT INTO reviews (product_id, rating, date, summary, body, recommend, reviewer_name, reviewer_email) VALUES ($1, $2, to_timestamp($3 / 1000.0) AT TIME ZONE 'UTC', $4, $5, $6, $7, $8)", params))
    .then((result) => {
      resolve(result);
    })
    .catch((err) => {
      reject(err);
    });
  // other code for photos, characteristics
});



module.exports = { get, reviewsPost };
