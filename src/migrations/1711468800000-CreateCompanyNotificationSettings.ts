import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCompanyNotificationSettings1711468800000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE company_notification_settings (
        company_id VARCHAR(45) NOT NULL,
        telegram_group_id VARCHAR(45) NULL,
        telegram_enabled BOOLEAN NOT NULL DEFAULT FALSE,
        created_at DATETIME NOT NULL,
        updated_at DATETIME NOT NULL,
        PRIMARY KEY (company_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE company_notification_settings;`);
  }
}
