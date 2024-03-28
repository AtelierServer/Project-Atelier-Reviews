require('dotenv').config();
const { Client } = require('pg');

const get = (queryParams) => {
  const client = new Client();
  return client.connect()
    .then(() => {
      let selectQueryStr = 'SELECT filtered_reviews.*, photo_agg.photos';
      let fromQueryStr = `
        FROM
          (SELECT * FROM reviews WHERE product_id = ${queryParams.product_id}) AS filtered_reviews
        LEFT JOIN
          (SELECT
             sub.review_id,
             COALESCE(json_agg(json_build_object('id', sub.id, 'url', sub.photo_url)) FILTER (WHERE sub.id IS NOT NULL), '[]'::json) AS photos
           FROM
             (SELECT
                filtered_reviews.id AS review_id,
                rp.id,
                rp.photo_url
              FROM
                (SELECT * FROM reviews WHERE product_id = ${queryParams.product_id}) AS filtered_reviews
              LEFT JOIN
                review_photos rp ON filtered_reviews.id = rp.review_id
             ) AS sub
           GROUP BY
             sub.review_id
          ) AS photo_agg
        ON
          filtered_reviews.id = photo_agg.review_id
      `;

      let pageQueryStr = '';
      let countQueryStr = '';
      let sortQueryStr = '';
      let offsetQueryStr = '';
      let additionalSelect = '';

      if (queryParams.page) {
        const offset = (queryParams.page - 1);
        offsetQueryStr = `OFFSET ${offset}`;
      }

      let limitQueryStr = `LIMIT ${queryParams.count || 5}`;

      if (queryParams.sort === 'newest') {
        sortQueryStr = 'ORDER BY filtered_reviews.date DESC';
      } else if (queryParams.sort === 'helpfulness') {
        sortQueryStr = 'ORDER BY filtered_reviews.helpfulness DESC';
      } else {
        additionalSelect = ', filtered_reviews.helpfulness - ((CURRENT_DATE - DATE(filtered_reviews.date)) / 10) AS relevance_score';
        sortQueryStr = 'ORDER BY relevance_score DESC';
      }

      let queryStr = `${selectQueryStr}${additionalSelect} ${fromQueryStr} ${sortQueryStr} ${limitQueryStr} ${offsetQueryStr};`;

      return client.query(queryStr);
    })
    .then((result) => {
      return result.rows;
    })
    .catch((err) => {
      return err;
    })
    .finally(() => {
      client.end();
    });
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
    })
    .finally(() => {
      client.end();
    });

  // other code for photos, characteristics
});



module.exports = { get, reviewsPost };
