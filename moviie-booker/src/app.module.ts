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

//https://www.youtube.com/watch?v=qvhqUMRuquw
@Module({
  imports: [ TypeOrmModule.forRoot({
    type:'mysql',
    host: 'mysql-domosecours.alwaysdata.net',
    port: 3306,
    database: 'domosecours_moviiebooker',
    entities,
    synchronize: true,
    username : '260656',
    password: '2vZvJ3PL@rduWme'
  }), AuthModule, MovieModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
