import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class UserAddEmail1606752189104 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'user',
      new TableColumn({
        name: 'email',
        type: 'varchar',
        isUnique: true,
        isNullable: false,
      }),
    );

    await queryRunner.addColumn(
      'user',
      new TableColumn({
        name: 'isEmailConfirmed',
        type: 'boolean',
        default: false,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('user', 'email');
    await queryRunner.dropColumn('user', 'isEmailConfirmed');
  }
}
