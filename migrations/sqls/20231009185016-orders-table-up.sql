/* Replace with your SQL commands */
CREATE TABLE orders (
    o_id SERIAL PRIMARY KEY,
    u_id bigint REFERENCES users(u_id)
);
