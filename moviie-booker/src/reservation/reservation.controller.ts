import {Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query, Req, UseGuards} from '@nestjs/common';
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import {MovieService} from "../movie/movie.service";
import {ReservationService} from "./reservation.service";
import {CreateReservationDto} from "./dto/reservation.dto";
import {LoginDto} from "../auth/dto/auth.dto";
import {ApiBearerAuth, ApiOperation} from "@nestjs/swagger";

@Controller('reservation')
export class ReservationController {
    constructor(private readonly reservationService: ReservationService) {}

    @ApiOperation({ summary: 'Creation d\'une reservation' })
    @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthGuard)
    @Post()
    createReservation(@Body() createReservationDto: CreateReservationDto, @Req() req){
        return this.reservationService.createReservation(createReservationDto, req)
    }
    @ApiOperation({ summary: 'Recuperer les reservations' })
    @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthGuard)
    @Get()
    getUserReservation(@Req() req){
        return this.reservationService.getAllUserReservation(req)
    }

    @ApiOperation({ summary: 'Supprimer une reservation' })
    @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    deleteReservation(@Req() req, @Param('id', ParseIntPipe) id: number){
        return this.reservationService.deleteReservation(req ,id)
    }

}
