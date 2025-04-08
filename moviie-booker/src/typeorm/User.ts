import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class User{
    @PrimaryGeneratedColumn({
        type: "bigint",
        name: "user_id"
    })
    id: number;

    @Column({
        nullable: false,
        unique: true
    })
    username: string;
    @Column({
        nullable: false,
    })
    password: string;
    @Column({
        nullable: false,
    })
    email: string;
}