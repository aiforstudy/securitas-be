import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCompanyEngineMonitorDetection1742965076840 implements MigrationInterface {
    name = 'CreateCompanyEngineMonitorDetection1742965076840'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_8415e2ae6055af59ec4b8c4da9\` ON \`engines\``);
        await queryRunner.query(`ALTER TABLE \`engines\` DROP COLUMN \`color\``);
        await queryRunner.query(`ALTER TABLE \`engines\` DROP COLUMN \`email\``);
        await queryRunner.query(`ALTER TABLE \`engines\` DROP COLUMN \`enable\``);
        await queryRunner.query(`ALTER TABLE \`engines\` DROP COLUMN \`icon\``);
        await queryRunner.query(`ALTER TABLE \`engines\` DROP COLUMN \`learn_more_url\``);
        await queryRunner.query(`ALTER TABLE \`engines\` DROP COLUMN \`related_engine\``);
        await queryRunner.query(`ALTER TABLE \`engines\` DROP COLUMN \`require_approval\``);
        await queryRunner.query(`ALTER TABLE \`engines\` DROP COLUMN \`seq_no_format\``);
        await queryRunner.query(`ALTER TABLE \`engines\` DROP COLUMN \`show_on_home\``);
        await queryRunner.query(`ALTER TABLE \`engines\` DROP COLUMN \`sms\``);
        await queryRunner.query(`ALTER TABLE \`engines\` DROP COLUMN \`title\``);
        await queryRunner.query(`ALTER TABLE \`engines\` DROP COLUMN \`weight\``);
        await queryRunner.query(`ALTER TABLE \`engines\` ADD \`description\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`engines\` ADD \`type\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`engines\` ADD \`version\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`engines\` ADD \`status\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`detections\` ADD \`approved\` varchar(45) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`detections\` ADD \`zone\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`detections\` DROP FOREIGN KEY \`FK_41a0dd7d6ecf8a9b91717221a4e\``);
        await queryRunner.query(`ALTER TABLE \`engines\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`engines\` DROP COLUMN \`id\``);
        await queryRunner.query(`ALTER TABLE \`engines\` ADD \`id\` varchar(36) NOT NULL PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`engines\` CHANGE \`name\` \`name\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`engines\` CHANGE \`created_at\` \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`engines\` CHANGE \`updated_at\` \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`detections\` DROP COLUMN \`engine\``);
        await queryRunner.query(`ALTER TABLE \`detections\` ADD \`engine\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`detections\` CHANGE \`status\` \`status\` enum ('PENDING', 'APPROVED', 'REJECTED', 'COMPLETED') NOT NULL DEFAULT 'PENDING'`);
        await queryRunner.query(`ALTER TABLE \`detections\` ADD CONSTRAINT \`FK_41a0dd7d6ecf8a9b91717221a4e\` FOREIGN KEY (\`engine\`) REFERENCES \`engines\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`detections\` DROP FOREIGN KEY \`FK_41a0dd7d6ecf8a9b91717221a4e\``);
        await queryRunner.query(`ALTER TABLE \`detections\` CHANGE \`status\` \`status\` enum ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED') NOT NULL DEFAULT 'PENDING'`);
        await queryRunner.query(`ALTER TABLE \`detections\` DROP COLUMN \`engine\``);
        await queryRunner.query(`ALTER TABLE \`detections\` ADD \`engine\` varchar(45) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`engines\` CHANGE \`updated_at\` \`updated_at\` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`engines\` CHANGE \`created_at\` \`created_at\` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`engines\` CHANGE \`name\` \`name\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`engines\` DROP COLUMN \`id\``);
        await queryRunner.query(`ALTER TABLE \`engines\` ADD \`id\` varchar(45) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`engines\` ADD PRIMARY KEY (\`id\`)`);
        await queryRunner.query(`ALTER TABLE \`detections\` ADD CONSTRAINT \`FK_41a0dd7d6ecf8a9b91717221a4e\` FOREIGN KEY (\`engine\`) REFERENCES \`engines\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`detections\` DROP COLUMN \`zone\``);
        await queryRunner.query(`ALTER TABLE \`detections\` DROP COLUMN \`approved\``);
        await queryRunner.query(`ALTER TABLE \`engines\` DROP COLUMN \`status\``);
        await queryRunner.query(`ALTER TABLE \`engines\` DROP COLUMN \`version\``);
        await queryRunner.query(`ALTER TABLE \`engines\` DROP COLUMN \`type\``);
        await queryRunner.query(`ALTER TABLE \`engines\` DROP COLUMN \`description\``);
        await queryRunner.query(`ALTER TABLE \`engines\` ADD \`weight\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`engines\` ADD \`title\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`engines\` ADD \`sms\` tinyint NULL`);
        await queryRunner.query(`ALTER TABLE \`engines\` ADD \`show_on_home\` tinyint NULL`);
        await queryRunner.query(`ALTER TABLE \`engines\` ADD \`seq_no_format\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`engines\` ADD \`require_approval\` tinyint NULL`);
        await queryRunner.query(`ALTER TABLE \`engines\` ADD \`related_engine\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`engines\` ADD \`learn_more_url\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`engines\` ADD \`icon\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`engines\` ADD \`enable\` tinyint NULL`);
        await queryRunner.query(`ALTER TABLE \`engines\` ADD \`email\` tinyint NULL`);
        await queryRunner.query(`ALTER TABLE \`engines\` ADD \`color\` varchar(255) NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_8415e2ae6055af59ec4b8c4da9\` ON \`engines\` (\`name\`)`);
    }

}
