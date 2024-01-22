import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSalt1705908750343 implements MigrationInterface {
    name = 'AddSalt1705908750343'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`items\` (\`id\` int NOT NULL, \`name\` varchar(255) NOT NULL, \`description\` varchar(255) NOT NULL, \`quantity\` int NOT NULL, \`price\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`salt\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`salt\``);
        await queryRunner.query(`DROP TABLE \`items\``);
    }

}
