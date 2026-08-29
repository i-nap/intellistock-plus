CREATE TABLE IF NOT EXISTS products (
    id          BIGSERIAL      PRIMARY KEY,
    name        VARCHAR(255)   NOT NULL,
    sku         VARCHAR(255)   NOT NULL UNIQUE,
    description TEXT,
    category    VARCHAR(255)   NOT NULL,
    unit        VARCHAR(50)    NOT NULL,
    unit_price  NUMERIC(10, 2) NOT NULL,
    created_at  TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP      DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_products_sku      ON products (sku);
CREATE INDEX IF NOT EXISTS idx_products_category ON products (category);
