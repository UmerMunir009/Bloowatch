import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateProductCategoriesTable implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

        await queryRunner.query(`
            CREATE TABLE product_categories (
                id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                product_id  UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
                category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
                created_at  TIMESTAMP DEFAULT NOW()
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS product_categories`);
    }
}
