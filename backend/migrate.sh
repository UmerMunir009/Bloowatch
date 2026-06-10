#!/bin/bash

psql "$DATABASE_URL" -f src/database/migrations/001_create_users_table.sql
psql "$DATABASE_URL" -f src/database/migrations/002_create_categories_table.sql
psql "$DATABASE_URL" -f src/database/migrations/003_create_products_table.sql
psql "$DATABASE_URL" -f src/database/migrations/004_create_cart_items_table.sql

echo "All migrations executed successfully!"