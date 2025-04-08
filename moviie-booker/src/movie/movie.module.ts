import { Module } from '@nestjs/common';
import {HttpModule} from "@nestjs/axios";
import {MovieService} from "./movie.service";
import {MovieController} from "./movie.controller";
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [HttpModule, ConfigModule],
    providers: [MovieService],
    controllers: [MovieController]
})
export class MovieModule {}
