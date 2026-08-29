CREATE TABLE IF NOT EXISTS suppliers (
    id             BIGSERIAL     PRIMARY KEY,
    name           VARCHAR(255)  NOT NULL,
    email          VARCHAR(255)  NOT NULL UNIQUE,
    phone          VARCHAR(30),
    address        TEXT,
    contact_person VARCHAR(255),
    website        VARCHAR(255),
    created_at     TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
    updated_at     TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_suppliers_email ON suppliers (email);
