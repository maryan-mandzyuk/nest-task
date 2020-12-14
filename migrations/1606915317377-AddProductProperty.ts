import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddProductProperty1606915317377 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'product',
      new TableColumn({
        name: 'property',
        type: 'json',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('product', 'property');
  }
}
