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
    email: string;
    @Column({
        nullable: false,
    })
    password: string;
}