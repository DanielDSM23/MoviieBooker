import { Injectable } from '@nestjs/common';
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


    getAllUserReservation(req){
        return this.reservationRepository.findOneBy({user: req.user.id});
    }
}
