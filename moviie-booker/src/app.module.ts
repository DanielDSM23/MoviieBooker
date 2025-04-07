import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import { AuthModule } from './auth/auth.module';
import entities from "./typeorm";

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
  }), AuthModule],
  controllers: [AppController, AuthController],
  providers: [AppService, AuthService],
})
export class AppModule {}
