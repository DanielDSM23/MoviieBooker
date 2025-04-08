import { ApiPropertyOptional } from '@nestjs/swagger';
import {IsOptional, IsString, IsInt, Min, Max} from 'class-validator';

export class MovieQueryDto {
    @ApiPropertyOptional({ example: 1, description: 'Page' })
    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(500)
    page?: number;

    @ApiPropertyOptional({ example: 'batman', description: 'Recherche' })
    @IsOptional()
    @IsString()
    search?: string;

    @ApiPropertyOptional({ example: 'false', description: 'contenu adulte' })
    @IsOptional()
    @IsString()
    include_adult?: string;

    @ApiPropertyOptional({ example: '2022', description: 'Année de publication principale' })
    @IsOptional()
    @IsString()
    primary_release_year?: string;

    @ApiPropertyOptional({ example: '2022', description: 'Année de sortie' })
    @IsOptional()
    @IsString()
    year?: string;
}
