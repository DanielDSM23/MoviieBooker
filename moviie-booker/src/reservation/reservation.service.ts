import {ConflictException, Injectable, NotFoundException, UnauthorizedException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Reservation as ReservationEntity} from "../typeorm/Reservation";
import {Between, Repository} from "typeorm";
import {JwtService} from "@nestjs/jwt";
import {CreateReservationDto} from "./dto/reservation.dto";

@Injectable()
export class ReservationService {
    constructor(
        @InjectRepository(ReservationEntity)
        private readonly reservationRepository: Repository<ReservationEntity>,
        private jwtService: JwtService
    ) {}

    //https://typeorm.io/find-options#advanced-options
    async createReservation(createReservationDto : CreateReservationDto, req){
        const reservationDate = new Date(createReservationDto.reservationDate);
        const twoHoursAfterReservationDate = new Date(reservationDate.getTime() + 2 * 60 * 60 * 1000); //2 heures en plus
        reservationDate.setMilliseconds(0);
        twoHoursAfterReservationDate.setMilliseconds(0); // evite les erreurs avec l'orm
        console.log(reservationDate, twoHoursAfterReservationDate);
        let reservations =await this.reservationRepository.findBy({
            user: {id: req.user.id},
            reservationDate: Between(reservationDate, twoHoursAfterReservationDate),
        });
        console.log(reservations);
        if(reservations.length != 0) {
            throw new ConflictException("Vous ne pouvez pas reserver sur cette plage horaire");
        }

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
