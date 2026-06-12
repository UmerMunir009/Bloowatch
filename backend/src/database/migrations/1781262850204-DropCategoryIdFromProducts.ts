import { MigrationInterface, QueryRunner } from "typeorm";

export class DropCategoryIdFromProducts implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
          ALTER TABLE products DROP COLUMN IF EXISTS category_id
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
          ALTER TABLE products ADD COLUMN category_id UUID REFERENCES categories(id) ON DELETE SET NULL
    `);
    }

}
