import {Controller, Get, Query, UseGuards} from '@nestjs/common';
import {MovieService} from "./movie.service";
import {ApiBearerAuth, ApiOperation, ApiTags} from "@nestjs/swagger";
import {MovieQueryDto} from "./dto/movie.dto";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
// https://docs.nestjs.com/techniques/http-module

@ApiTags('Movies')
@Controller('movie')
export class MovieController {
    constructor(private readonly movieService: MovieService) {}
    @UseGuards(JwtAuthGuard)
    @Get("movies")
    @ApiOperation({ summary: 'Chercher ou filtrer un film' })
    @ApiBearerAuth('access-token')
    movies(@Query() query: MovieQueryDto) {
        return this.movieService.findMovies({
            page: query.page ?? 1,
            search: query.search ?? '',
            include_adult: query.include_adult ?? '',
            primary_release_year: query.primary_release_year ?? '',
            year: query.year ?? '',
        });
    }

    @UseGuards(JwtAuthGuard)
    @Get("genres")
    @ApiOperation({ summary: 'Liste les genres' })
    @ApiBearerAuth('access-token')
    searchMovie(){
        return this.movieService.getGenres();
    }



}
