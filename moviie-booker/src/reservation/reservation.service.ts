import {Injectable, NotFoundException, UnauthorizedException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Reservation as ReservationEntity} from "../typeorm/Reservation";
import {Repository} from "typeorm";
import {JwtService} from "@nestjs/jwt";
import {CreateReservationDto} from "./dto/reservation.dto";

@Injectable()
export class ReservationService {
    constructor(
        @InjectRepository(ReservationEntity)
        private readonly reservationRepository: Repository<ReservationEntity>,
        private jwtService: JwtService
    ) {}

    createReservation(createReservationDto : CreateReservationDto, req){
        let newReservation = this.reservationRepository.create(createReservationDto);
        newReservation = {...newReservation, user:req.user.id}
        return this.reservationRepository.save(newReservation);
    }


    async getAllUserReservation(req) {
        const reservations = await this.reservationRepository.findBy({
            user: { id: req.user.id }
        });

        return reservations.map(
            ({user, ...rest}) => rest);
    }

    async deleteReservation(req, id: number){
        const reservation = await this.reservationRepository.findOneBy({id});
        if(reservation?.user.id != req.user.id) { throw new UnauthorizedException(); }
        const result = await this.reservationRepository.delete(id)
        if (result.affected === 0) {
            throw new NotFoundException(`Reservation with ID ${id} not found`);
        }

        return {
            message: `Reservation with ID ${id} has been deleted`,
        };
    }


}
