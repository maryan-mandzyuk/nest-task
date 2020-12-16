import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class AddOauthAppTable1608113769227 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    await queryRunner.createTable(
      new Table({
        name: 'oauthApps',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isUnique: true,
            generationStrategy: 'uuid',
            default: `uuid_generate_v4()`,
          },
          {
            name: 'name',
            type: 'varchar',
            length: '25',
          },
          {
            name: 'secret',
            type: 'varchar',
            length: '250',
          },
          {
            name: 'uri',
            type: 'varchar',
          },
          {
            name: 'redirectUri',
            type: 'varchar',
          },
          {
            name: 'user_id',
            type: 'int',
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'oauthApps',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('oauthApps');
  }
}
