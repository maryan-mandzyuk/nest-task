import {MigrationInterface, QueryRunner} from "typeorm";

export class AddLogTrigger1606306617999 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
        create trigger product_logs_trigger
        after insert or update or delete  on product
        for each row execute function product_logs_func()`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`
        DROP TRIGGER product_logs_trigger ON product;`
        )
    }

}
