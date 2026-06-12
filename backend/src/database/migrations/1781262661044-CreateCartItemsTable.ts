import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCartItemsTable implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

        await queryRunner.query(`
        CREATE TABLE cart_items (
            id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            product_id  UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
            quantity    INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
            created_at  TIMESTAMP DEFAULT NOW(),
            updated_at  TIMESTAMP DEFAULT NOW(),

            UNIQUE(user_id, product_id)
        )
    `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS cart_items`);
    }

}
