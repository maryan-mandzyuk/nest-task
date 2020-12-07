import { USER_ROLES } from 'src/constants';
import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddUserRoles1607082522979 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'role',
        type: 'varchar',
        isNullable: false,
        enum: [USER_ROLES.customer, USER_ROLES.seller],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('users', 'role');
  }
}
