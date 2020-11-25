import {MigrationInterface, QueryRunner} from "typeorm";

export class AddLogFunction1606306208912 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`create or replace function  product_logs_func()
        returns trigger as $body$
        begin 
            if(TG_OP = 'INSERT') then 
                insert into logs (operation_type, product_id, data_type, user_id)
                values('INSERT', new.id, 'products', new.user_id);
                return new;
            elseif (TG_OP = 'UPDATE') then
                insert into logs (operation_type, product_id, data_type, user_id)
                values('UPDATE', new.id, 'products', new.user_id);
                return new;
            elseif (TG_OP = 'DELETE') then
                insert into logs (operation_type, product_id, data_type, user_id)
                values('DELETE', old.id, 'products', old.user_id);
                return old;
            end if;
        end;
        $body$
        language plpgsql`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP FUNCTIO product_logs_func()`);
    }

}
