import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class AddUsersTable1606231068907 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'users',
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    isPrimary: true
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
        }), true);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('users');
    }
}
