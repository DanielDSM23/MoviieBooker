import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "./User";

@Entity()
export class Reservation {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, user => user.id, { eager: true })
    user: User;

    movie: string;

    @Column({ type: 'timestamp' })
    reservationDate: Date;
}