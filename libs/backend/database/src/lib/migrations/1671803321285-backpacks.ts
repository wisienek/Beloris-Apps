import { MigrationInterface, QueryRunner } from "typeorm";

export class backpacks1671803321285 implements MigrationInterface {
    name = 'backpacks1671803321285';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`backpack\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`backpack\` DROP COLUMN \`id\``);
        await queryRunner.query(`ALTER TABLE \`backpack\` DROP COLUMN \`playerUuid\``);
        await queryRunner.query(`ALTER TABLE \`backpack\` ADD \`uuid\` varchar(36) NOT NULL PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`backpack\` DROP COLUMN \`itemData\``);
        await queryRunner.query(`ALTER TABLE \`backpack\` ADD \`itemData\` longtext NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`backpack\` DROP COLUMN \`itemData\``);
        await queryRunner.query(`ALTER TABLE \`backpack\` ADD \`itemData\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`backpack\` DROP COLUMN \`uuid\``);
        await queryRunner.query(`ALTER TABLE \`backpack\` ADD \`playerUuid\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`backpack\` ADD \`id\` varchar(36) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`backpack\` ADD PRIMARY KEY (\`id\`)`);
    }

}
