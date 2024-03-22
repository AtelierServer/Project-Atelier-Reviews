CREATE DATABASE productsDB;

-- DROP TABLE products;
-- DROP TABLE characteristic_reviews;
-- DROP TABLE review_photos;
-- DROP TABLE reviews;

CREATE TABLE IF NOT EXISTS products ( id SERIAL, name VARCHAR(255), slogan TEXT, description TEXT, category VARCHAR(255), default_price INT);

CREATE TABLE IF NOT EXISTS characteristic_reviews ( id SERIAL, characteristic_id INT, review_id INT, value_rating INT);

CREATE TABLE IF NOT EXISTS review_photos ( id SERIAL, review_id INT, photo_url TEXT);

CREATE TABLE IF NOT EXISTS reviews ( id SERIAL,
product_id INT,
rating INT,
date TIMESTAMP WITH TIME ZONE,
summary TEXT,
body TEXT,
recommend BOOLEAN,
reported BOOLEAN,
reviewer_name VARCHAR(255),
reviewer_email VARCHAR(255),
response TEXT,
helpfulness INT
);

ALTER TABLE reviews ADD COLUMN temp_date BIGINT;

COPY products(id, name, slogan, description, category, default_price) FROM '/Users/amarinsam/Documents/Code/Hack Reactor/SDC_PROJECT-ATELIER/Project-Atelier-Reviews/database/data/product.csv' DELIMITER ',' CSV HEADER;

COPY characteristic_reviews(id, characteristic_id, review_id, value_rating) FROM '/Users/amarinsam/Documents/Code/Hack Reactor/SDC_PROJECT-ATELIER/Project-Atelier-Reviews/database/data/characteristic_reviews.csv' DELIMITER ',' CSV HEADER;

COPY review_photos(id, review_id, photo_url) FROM '/Users/amarinsam/Documents/Code/Hack Reactor/SDC_PROJECT-ATELIER/Project-Atelier-Reviews/database/data/reviews_photos.csv' DELIMITER ',' CSV HEADER;

COPY reviews(id, product_id, rating, temp_date, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness) FROM '/Users/amarinsam/Documents/Code/Hack Reactor/SDC_PROJECT-ATELIER/Project-Atelier-Reviews/database/data/reviews.csv' WITH (FORMAT csv, DELIMITER ',', HEADER true, NULL 'null');

UPDATE reviews SET date = to_timestamp(temp_date / 1000) AT TIME ZONE 'UTC';

ALTER TABLE reviews DROP COLUMN temp_date;