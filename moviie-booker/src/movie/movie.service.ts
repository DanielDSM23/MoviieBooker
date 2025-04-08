
import { catchError, firstValueFrom } from 'rxjs';
import {Injectable, Logger} from "@nestjs/common";
import {MovieController} from "./movie.controller";
import {HttpService} from '@nestjs/axios';
import {AxiosError} from "axios";

@Injectable()
export class MovieService {
    constructor(
        private readonly httpService: HttpService
    ) {}



}
