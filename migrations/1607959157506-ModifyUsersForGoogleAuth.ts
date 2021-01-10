import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class ModifyUsersForGoogleAuth1607959157506
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'users',
      'password',
      new TableColumn({
        name: 'password',
        type: 'varchar',
        isNullable: true,
      }),
    );

    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'isThirdPartyRegister',
        type: 'boolean',
        default: false,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'users',
      'password',
      new TableColumn({
        name: 'password',
        type: 'varchar',
      }),
    );

    await queryRunner.dropColumn('users', 'isThirdPartyRegister');
  }
}
