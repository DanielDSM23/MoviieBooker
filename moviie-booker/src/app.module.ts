import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import { AuthModule } from './auth/auth.module';
import { MovieController } from './movie/movie.controller';
import { MovieService } from './movie/movie.service';
import entities from "./typeorm";
import {HttpService} from "@nestjs/axios";
import {MovieModule} from "./movie/movie.module";
import { ReservationModule } from './reservation/reservation.module';
import * as process from "process";

//https://www.youtube.com/watch?v=qvhqUMRuquw
@Module({
  imports: [ TypeOrmModule.forRoot({
    type:'mysql',
    host: process.env.DB_HOST,
    port: 3306,
    database: process.env.DB_DATABASE,
    entities,
    synchronize: true,
    username : process.env.DB_USER,
    password:  process.env.DB_PASS,
    logging: true,
  }), AuthModule, MovieModule, ReservationModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
