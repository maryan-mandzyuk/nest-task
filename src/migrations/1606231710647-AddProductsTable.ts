import {MigrationInterface, QueryRunner, Table, TableForeignKey} from "typeorm";

export class AddProductsTable1606231710647 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'products',
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    isPrimary: true
                },
                {
                    name: 'name',
                    type: 'varchar'
                },
                {
                    name: 'description',
                    type: 'varchar'
                },
                {
                    name: 'price',
                    type: 'varchar'
                },
                {
                    name: 'isDeleted',
                    type: 'boolean',
                    default: 'false'
                },
                {
                    name: 'createdAt',
                    type: 'timestamp',
                    default: 'now()'
                },
            ]
        }), true);

        await queryRunner.createForeignKey('products', new TableForeignKey({
            columnNames: ['user_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            onDelete: "CASCADE"
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('products');
    }

}
