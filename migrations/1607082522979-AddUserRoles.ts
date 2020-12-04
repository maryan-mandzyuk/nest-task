import { USER_ROLES } from 'src/constants';
import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddUserRoles1607082522979 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'user',
      new TableColumn({
        name: 'role',
        type: 'varchar',
        isNullable: false,
        enum: [USER_ROLES.customer, USER_ROLES.seller],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('user', 'role');
  }
}
