/* Replace with your SQL commands */
CREATE TABLE users (
    u_id SERIAL PRIMARY KEY,
    firstname VARCHAR(150),
    lastname VARCHAR(150),
    username VARCHAR(255),
    pwd_digest VARCHAR(255)
);