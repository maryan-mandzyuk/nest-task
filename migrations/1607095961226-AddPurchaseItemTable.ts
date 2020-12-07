import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class AddPurchaseItemTable1607095961226 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'purchase_item',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
          },
          {
            name: 'quantity',
            type: 'int',
          },
          {
            name: 'purchase_id',
            type: 'int',
          },
          {
            name: 'product_id',
            type: 'int',
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'purchaseItem',
      new TableForeignKey({
        columnNames: ['purchase_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'purchase',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'purchaseItem',
      new TableForeignKey({
        columnNames: ['product_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'product',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('purchaseItem');
  }
}
