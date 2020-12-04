import { PURCHASE_STATUS } from 'src/constants';
import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class AddPurchaseTable1607094489604 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'purchase',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
          },
          {
            name: 'email',
            type: 'varchar',
          },
          {
            name: 'phoneNumber',
            type: 'varchar',
          },
          {
            name: 'status',
            type: 'varchar',
            enum: [
              PURCHASE_STATUS.received,
              PURCHASE_STATUS.shipped,
              PURCHASE_STATUS.completed,
            ],
            default: `"${PURCHASE_STATUS.received}"`,
          },
          {
            name: 'address',
            type: 'varchar',
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('purchase');
  }
}
