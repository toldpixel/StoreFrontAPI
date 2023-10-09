/* Replace with your SQL commands */
CREATE TABLE order_products (
    op_id SERIAL PRIMARY KEY,
    quantity VARCHAR(150),
    o_id bigint REFERENCES orders(o_id),
    p_id bigint REFERENCES products(p_id)
);