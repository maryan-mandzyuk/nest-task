import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class AddColumnsPurchaseTable1607431220626
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('purchase', [
      new TableColumn({
        name: 'user_id',
        type: 'int',
      }),
      new TableColumn({
        name: 'createdAt',
        type: 'timestamp',
        default: 'now()',
      }),
    ]);

    await queryRunner.createForeignKey(
      'purchase',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('purchase', 'user_id');
    await queryRunner.dropColumn('purchase', 'createdAt');
  }
}
