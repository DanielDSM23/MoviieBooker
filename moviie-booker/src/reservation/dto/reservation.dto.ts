import {ApiProperty} from "@nestjs/swagger";
import {IsDateString, IsEmail, IsInt, IsNotEmpty, MinLength} from "class-validator";

export class CreateReservationDto{
    @ApiProperty({ example: '1451013', description: 'id du film' })
    @IsEmail()
    @MinLength(10)
    film_id: string;
    @ApiProperty({ description: 'Date et heure du film' })
    @IsDateString()
    reservationDate: string;

}