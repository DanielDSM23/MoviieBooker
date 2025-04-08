import {Controller, Get} from '@nestjs/common';
import {HttpService} from "@nestjs/axios";
import {MovieService} from "./movie.service";

@Controller('movie')
export class MovieController {
    constructor(private readonly movieService: MovieService) {}
    @Get("movies")
    movies(){
        return this.movieService.findMovies(null);
    }
    @Get("search")
    searchMovie(){
        return this.movieService.searchMovies(null);
    }



}
