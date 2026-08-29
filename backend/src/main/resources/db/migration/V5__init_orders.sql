CREATE TABLE IF NOT EXISTS purchase_orders (
    id                BIGSERIAL      PRIMARY KEY,
    order_number      VARCHAR(255)   UNIQUE,
    supplier_id       BIGINT         NOT NULL REFERENCES suppliers (id),
    status            VARCHAR(50)    NOT NULL,
    total_amount      NUMERIC(10, 2),
    notes             TEXT,
    expected_delivery DATE,
    ordered_at        TIMESTAMP,
    created_by        VARCHAR(255),
    created_at        TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
    updated_at        TIMESTAMP      DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_orders_status      ON purchase_orders (status);
CREATE INDEX IF NOT EXISTS idx_orders_supplier_id ON purchase_orders (supplier_id);
CREATE INDEX IF NOT EXISTS idx_orders_ordered_at  ON purchase_orders (ordered_at);

CREATE TABLE IF NOT EXISTS order_items (
    id          BIGSERIAL      PRIMARY KEY,
    order_id    BIGINT         NOT NULL REFERENCES purchase_orders (id) ON DELETE CASCADE,
    product_id  BIGINT         NOT NULL REFERENCES products (id),
    quantity    INTEGER        NOT NULL,
    unit_price  NUMERIC(10, 2) NOT NULL,
    subtotal    NUMERIC(10, 2) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id   ON order_items (order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items (product_id);
