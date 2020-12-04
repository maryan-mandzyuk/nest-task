import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddConstraintProducts1607011736091 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `create or replace function is_name_exist(userId int, productName varchar) returns boolean as $$
        select exists (
          select 1
          from product
          where user_id = $1 and name = $2
        );
      $$ language sql;`,
    );

    await queryRunner.query(`
    create or replace function update_if_exist()
    returns trigger as $body$
    begin 
        if(is_name_exist(new.user_id, new.name) = true) then 
            update product 
            set description = new.description,
                price = new.price,
                property = new.property
            where product.name = new.name and product.user_id = new.user_id;
            return null;
        else
            return new;
        end if;
    end;
    $body$
    language plpgsql
    `);

    await queryRunner.query(`
    create trigger update_if_exist_trigger
    before insert on product
    for each row execute function update_if_exist()`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TRIGGER update_if_exist_trigger ON product`);
    await queryRunner.query(`DROP FUNCTION IF EXISTS update_if_exist();`);
    await queryRunner.query(
      `DROP FUNCTION IF EXISTS is_name_unique(INT, TEXT);`,
    );
  }
}
