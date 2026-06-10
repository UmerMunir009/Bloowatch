CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE products (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id   UUID REFERENCES categories(id) ON DELETE SET NULL,
  name          VARCHAR(255)  NOT NULL,
  slug          VARCHAR(255)  UNIQUE NOT NULL,
  description   TEXT,
  price         NUMERIC(10, 2) NOT NULL, 
  stock_quantity INT           NOT NULL DEFAULT 0,
  images        TEXT[]         DEFAULT '{}', 
  created_at    TIMESTAMP     DEFAULT NOW(),
  updated_at    TIMESTAMP     DEFAULT NOW()
);

