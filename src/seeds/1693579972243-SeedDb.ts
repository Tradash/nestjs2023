import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedDb1693579972243 implements MigrationInterface {
    name = 'SeedDb1693579972243'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("insert into tags (name) values ('dragons'), ('coffee'), ('nestjs')");
        // password is 123
        await queryRunner.query(`insert into users (username, email, password) values ('foo', 'foo@gmail.com', '9a59d0113d64b2fec1bdbacd5e6c76da3ced739b3c14488c3defd931897fb0fcc2f42462edf6569371f9f1ad19f247a7b90e7de29d11cd0e9fba7263606696a0')`);

        await queryRunner.query(`insert into articles (slug,title, description, body, "tagList", "authorId") values ('first article', 'first article', 'first article desc', 'first article body', 'coffee,dragons',1)`);
        await queryRunner.query(`insert into articles (slug,title, description, body, "tagList", "authorId") values ('second article', 'second article', 'second article desc', 'second article body', 'coffee,dragons',1)`);
    }


    public async down(): Promise<void> {

    }

}
