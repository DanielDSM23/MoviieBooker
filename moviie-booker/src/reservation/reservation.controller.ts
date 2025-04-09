import {Body, Controller, Get, Post, Query, Req, UseGuards} from '@nestjs/common';
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import {MovieService} from "../movie/movie.service";
import {ReservationService} from "./reservation.service";
import {CreateReservationDto} from "./dto/reservation.dto";
import {LoginDto} from "../auth/dto/auth.dto";

@Controller('reservation')
export class ReservationController {
    constructor(private readonly reservationService: ReservationService) {}
    @UseGuards(JwtAuthGuard)
    @Post()
    createReservation(@Body() createReservationDto: CreateReservationDto, @Req() req){
        return this.reservationService.createReservation(createReservationDto, req)
    }
    @UseGuards(JwtAuthGuard)
    @Get()
    getUserReservation(@Req() req){
        return this.reservationService.getAllUserReservation(req)
    }

}
