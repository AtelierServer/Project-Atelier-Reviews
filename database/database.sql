CREATE DATABASE productsDB;

CREATE TABLE IF NOT EXISTS products ( id INT, name VARCHAR(255), slogan TEXT, description TEXT, category VARCHAR(255), default_price INT);

CREATE TABLE IF NOT EXISTS characteristic_reviews ( id INT, characteristic_id INT, review_id INT, value_rating INT);

CREATE TABLE IF NOT EXISTS review_photos ( id INT, review_id INT, photo_url TEXT);

CREATE TABLE IF NOT EXISTS reviews ( id INT,
product_id INT,
rating INT,
date TEXT,
summary TEXT,
body TEXT,
recommend BOOLEAN,
reported BOOLEAN,
reviewer_name VARCHAR(255),
reviewer_email VARCHAR(255),
response TEXT,
helpfulness INT
);

COPY products(id, name, slogan, description, category, default_price) FROM '/Users/amarinsam/Documents/Code/Hack Reactor/SDC_PROJECT-ATELIER/Project-Atelier-Reviews/database/data/product.csv' DELIMITER ',' CSV HEADER;

COPY characteristic_reviews(id, characteristic_id, review_id, value_rating) FROM '/Users/amarinsam/Documents/Code/Hack Reactor/SDC_PROJECT-ATELIER/Project-Atelier-Reviews/database/data/characteristic_reviews.csv' DELIMITER ',' CSV HEADER;

COPY review_photos(id, review_id, photo_url) FROM '/Users/amarinsam/Documents/Code/Hack Reactor/SDC_PROJECT-ATELIER/Project-Atelier-Reviews/database/data/reviews_photos.csv' DELIMITER ',' CSV HEADER;

COPY reviews FROM '/Users/amarinsam/Documents/Code/Hack Reactor/SDC_PROJECT-ATELIER/Project-Atelier-Reviews/database/data/reviews.csv' WITH (FORMAT csv, DELIMITER ',', HEADER true, NULL 'null');