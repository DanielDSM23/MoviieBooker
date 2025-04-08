
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

    findMovies(page: number, search: string, sort: string) {
        const token = process.env.TMDB_SECRET;
        let url = `https://api.themoviedb.org/3/movie/now_playing?language=fr-FR&page=${page}`;
        if (search) {
            url = `https://api.themoviedb.org/3/search/movie?query=${search}&page=${page}&language=en-US`;
        }
        if (sort) {
            url += `&sort_by=${sort}`;
        }

        return this.httpService
            .get(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .pipe(map(response => response.data));
    }

    searchMovies(params: {
        query: string;
        page?: number;
        include_adult?: boolean;
        language?: string;
        primary_release_year?: string;
        region?: string;
        year?: string;
    }) {
        const token = process.env.TMDB_SECRET;

        const queryParams = new URLSearchParams({
            query: params.query,
            page: String(params.page ?? 1),
            include_adult: String(params.include_adult ?? false),
            language: params.language ?? 'en-US',
        });

        if (params.primary_release_year) {
            queryParams.append('primary_release_year', params.primary_release_year);
        }

        if (params.region) {
            queryParams.append('region', params.region);
        }

        if (params.year) {
            queryParams.append('year', params.year);
        }

        const url = `https://api.themoviedb.org/3/search/movie?${queryParams.toString()}`;

        return this.httpService.get(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }).pipe(map(response => response.data));
    }

    getGenres(language = 'en-US') {
        const token = process.env.TMDB_SECRET;
        const url = `https://api.themoviedb.org/3/genre/movie/list?language=${language}`;

        return this.httpService.get(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }).pipe(map(response => response.data));
    }


}
