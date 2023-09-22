import { ArticleEntity } from "@app/article/article.entity";
import { salt } from "@app/config";
import { createHashWithSalt } from "@app/utils/createHashWithSalt";
import { Hash } from "node:crypto";
import { BeforeInsert, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'users' })
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    username: string;

    @Column({ default: "" })
    bio: string

    @Column({ default: "" })
    image: string;

    @Column({ select: false })
    password: string;

    @BeforeInsert()
    hashPassword() {
        this.password = createHashWithSalt(this.password, salt)
    }

    @OneToMany(() => ArticleEntity, (article) => article.author)
    articles: ArticleEntity[]

}