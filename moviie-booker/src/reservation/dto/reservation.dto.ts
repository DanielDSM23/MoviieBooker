import {ApiProperty} from "@nestjs/swagger";
import {IsDateString, IsInt, IsString} from "class-validator";

export class CreateReservationDto{
    @ApiProperty({ example: '1451013', description: 'id du film' })
    @IsString()
    film_id: string;
    @ApiProperty({ description: 'Date et heure du film' })
    @IsDateString({}, {
        message: 'La date doit être une date ISO valide (ex: 2025-04-10T15:00:00Z).'
    })
    reservationDate: Date;

}


export class DeleteReservationDto{
    @ApiProperty({ description: 'Id de reservation' })
    @IsInt()
    reservationDate: number;
}