import { createHashWithSalt } from "@app/utils/createHashWithSalt";
import { Hash } from "node:crypto";
import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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

    @Column()
    password: string;

    @BeforeInsert()
    hashPassword() {
        this.password = createHashWithSalt(this.password, "10")
    }

}