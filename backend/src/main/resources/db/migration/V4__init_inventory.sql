CREATE TABLE IF NOT EXISTS inventory_items (
    id                BIGSERIAL    PRIMARY KEY,
    product_id        BIGINT       NOT NULL UNIQUE REFERENCES products (id),
    quantity          INTEGER      NOT NULL,
    reorder_threshold INTEGER      NOT NULL,
    location          VARCHAR(100),
    status            VARCHAR(50)  NOT NULL,
    created_at        TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    updated_at        TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_inventory_product_id ON inventory_items (product_id);
CREATE INDEX IF NOT EXISTS idx_inventory_status     ON inventory_items (status);

CREATE TABLE IF NOT EXISTS inventory_logs (
    id                  BIGSERIAL   PRIMARY KEY,
    inventory_item_id   BIGINT      NOT NULL REFERENCES inventory_items (id),
    movement_type       VARCHAR(50) NOT NULL,
    quantity_change     INTEGER     NOT NULL,
    previous_quantity   INTEGER     NOT NULL,
    new_quantity        INTEGER     NOT NULL,
    note                TEXT,
    created_by          VARCHAR(255),
    created_at          TIMESTAMP   DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_inv_logs_item_id    ON inventory_logs (inventory_item_id);
CREATE INDEX IF NOT EXISTS idx_inv_logs_created_at ON inventory_logs (created_at);
