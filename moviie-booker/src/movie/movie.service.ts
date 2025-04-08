
import {catchError, firstValueFrom, map} from 'rxjs';
import {Injectable, Logger} from "@nestjs/common";
import {MovieController} from "./movie.controller";
import {HttpService} from '@nestjs/axios';
import {AxiosError} from "axios";
import * as process from "process";

@Injectable()
export class MovieService {
    constructor(
        private readonly httpService: HttpService
    ) {}

    findMovies(params :{ page: number, search: string, include_adult: string, primary_release_year: string, year: string }) {
        const token = process.env.TMDB_SECRET;
        let url = `https://api.themoviedb.org/3/movie/now_playing?language=fr-FR&page=${+params.page}`;
        if (params.search) url = `https://api.themoviedb.org/3/search/movie?query=${params.search}&page=${+params.page}&language=fr-FR`;
        if (params.include_adult == "true") url+= `&include_adult=true`
        if (params.primary_release_year) url+= `&primary_release_year=${params.primary_release_year}`
        if (params.year) url+= `&year=${params.primary_release_year}`
        return this.httpService
            .get(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .pipe(map(response => response.data));
    }

    getGenres() {
        const token = process.env.TMDB_SECRET;
        const url = `https://api.themoviedb.org/3/genre/movie/list?language=fr-FR`;

        return this.httpService.get(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }).pipe(map(response => response.data));
    }


}
