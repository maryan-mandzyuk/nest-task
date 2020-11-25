import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class AddUsersTable1606231068907 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'user',
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    isPrimary: true,
                    isGenerated: true
                },
                {
                    name: 'userName',
                    type: 'varchar'
                },
                {
                    name: 'firstName',
                    type: 'varchar'
                },
                {
                    name: 'lastName',
                    type: 'varchar'
                },
                {
                    name: 'password',
                    type: 'varchar'
                },
            ]
        }), false);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('user');
    }
}
