require('dotenv').config();
const { Client } = require('pg');

const get = (queryParams) => {
  return new Promise((resolve, reject) => {
    const client = new Client();
    client.connect()
      .then(() => {
        let selectQueryStr = 'SELECT *'
        let pageQueryStr = '';
        let countQueryStr = '';
        let sortQueryStr = '';
        let product_idQueryStr = '';
        let filterQueryStr = ' AND date IS NOT NULL ';
        let offsetQueryStr = '';

        if (!queryParams.product_id) {
          const error = new Error('No query parameters provided')
          error.code = 'ERR_BAD_REQUEST';
          error.status = 422;
          reject(error);
          return;
        }

        product_idQueryStr = `WHERE product_id = ${queryParams.product_id}`;

        const count = queryParams.count ? queryParams.count : 5;

        if (queryParams.page) {
          const offset = (queryParams.page - 1);
          offsetQueryStr = `OFFSET ${offset}`;
        }
        if (queryParams.count) {
          countQueryStr = `LIMIT ${queryParams.count}`
        } else {
          countQueryStr = 'LIMIT 5'
        }
        if (queryParams.sort === 'newest') {
          console.log('here')
          sortQueryStr = 'ORDER BY date DESC'
        } else if (queryParams.sort === 'helpfulness') {
          sortQueryStr = 'ORDER BY helpfulness DESC'
          filterQueryStr += 'AND helpfulness IS NOT NULL '
        } else {
          selectQueryStr += ' , helpfulness - ((CURRENT_DATE - DATE(date)) / 10) AS relevance_score'
          sortQueryStr = 'ORDER BY relevance_score DESC'
          filterQueryStr += 'AND helpfulness IS NOT NULL '
        }

        const queryStr = selectQueryStr + ' FROM reviews ' + product_idQueryStr + filterQueryStr + sortQueryStr + ' ' + countQueryStr + ' ' + offsetQueryStr + ';';
        return client.query(queryStr)

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
  const client = new Client();
  client.connect()
    .then(() => {
      if (params[8].length === 0) {
        return client.query("INSERT INTO reviews (product_id, rating, date, summary, body, recommend, reviewer_name, reviewer_email) VALUES ($1, $2, to_timestamp($3 / 1000.0) AT TIME ZONE 'UTC', $4, $5, $6, $7, $8) RETURNING id;", params.slice(0, 8))
          .then((result) => {
            const review_id = result.rows[0].id;
            let valueString = 'VALUES ';
            const characteristics = params[9]
            for (const [key, value] of Object.entries(characteristics)) {
              valueString += `(${review_id}, ${key}, ${value}), `
            }
            valueString = valueString.slice(0, -2);

            const queryStr = "INSERT INTO characteristic_reviews (review_id, characteristic_id, value_rating) " + valueString + ' RETURNING id' + ';';
            return client.query(queryStr)
          })
          // .then((result) => {
          //   console.log(result.rows, 'result after characteristics')
          // })
          .catch((err) => {
            reject(err);
          })
      }
      // else, write to photos as well
    })
    .then((result) => {
      resolve(result);
    })
    .catch((err) => {
      reject(err);
    });

  // other code for photos, characteristics
});



module.exports = { get, reviewsPost };
