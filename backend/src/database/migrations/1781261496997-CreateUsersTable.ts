import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsersTable1781261496997 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
        await queryRunner.query(`CREATE TYPE user_role AS ENUM ('user', 'admin')`);

        await queryRunner.query(`
        CREATE TABLE users (
            id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            name        VARCHAR(100)  NOT NULL,
            email       VARCHAR(150)  UNIQUE NOT NULL,
            password    VARCHAR(255)  NOT NULL,
            role        user_role     NOT NULL DEFAULT 'user',
            created_at  TIMESTAMP     DEFAULT NOW(),
            updated_at  TIMESTAMP     DEFAULT NOW()
        )
       `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS users`);
        await queryRunner.query(`DROP TYPE IF EXISTS user_role`);
        await queryRunner.query(`DROP EXTENSION IF EXISTS "uuid-ossp"`);
    }
}
