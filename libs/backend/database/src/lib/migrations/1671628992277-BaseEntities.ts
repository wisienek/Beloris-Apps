import { MigrationInterface, QueryRunner } from 'typeorm';

export class BaseEntities1671628992277 implements MigrationInterface {
  name = 'BaseEntities1671628992277';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`game_dc_link\` (\`id\` int NOT NULL AUTO_INCREMENT, \`discordId\` varchar(255) NOT NULL, \`uuid\` text NOT NULL, \`playerName\` text NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`version\` (\`id\` varchar(36) NOT NULL, \`major\` int UNSIGNED NOT NULL, \`minor\` int UNSIGNED NOT NULL, \`isCurrent\` tinyint NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_f02a2968cc0da218cc97a9fd5a\` (\`major\`, \`minor\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`downloader_file\` (\`id\` varchar(36) NOT NULL, \`isPrimaryBundle\` tinyint NULL, \`hash\` varchar(512) NULL, \`name\` varchar(255) NOT NULL, \`downloadPath\` varchar(255) NULL, \`savePath\` varchar(255) NOT NULL, \`fileSize\` float UNSIGNED NULL, \`fileType\` enum ('unknown', 'config', 'mod', 'asset', 'bundle') NOT NULL, \`required\` tinyint NOT NULL DEFAULT 1, \`fileAction\` enum ('download', 'modify', 'delete') NOT NULL DEFAULT 'download', \`versionId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`backpack\` (\`id\` varchar(36) NOT NULL, \`playerUuid\` text NULL, \`inventoryName\` text NOT NULL, \`itemData\` text NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`downloader_file\` ADD CONSTRAINT \`FK_8f865de2c8e3f2e8c34f0b96103\` FOREIGN KEY (\`versionId\`) REFERENCES \`version\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`downloader_file\` DROP FOREIGN KEY \`FK_8f865de2c8e3f2e8c34f0b96103\``,
    );
    await queryRunner.query(`DROP TABLE \`backpack\``);
    await queryRunner.query(`DROP TABLE \`downloader_file\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_f02a2968cc0da218cc97a9fd5a\` ON \`version\``,
    );
    await queryRunner.query(`DROP TABLE \`version\``);
    await queryRunner.query(`DROP TABLE \`game_dc_link\``);
  }
}
