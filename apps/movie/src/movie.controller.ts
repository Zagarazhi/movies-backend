import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { MovieService } from './movie.service';
import { MessagePattern } from "@nestjs/microservices";
import { AccessTokenGuard, CreateMovieDto, Roles, RolesGuard, UpdateMovieDto } from "@app/common";
import { Movie } from "@app/common";

@Controller('/movies')
export class MovieController {
    constructor(private readonly movieService: MovieService) {}

    @MessagePattern({cmd: 'movie'})
    async createMovie(data: CreateMovieDto) : Promise<void | Movie> {
        const result = await this.movieService.createMovie(data);
        return result;
    }

    @MessagePattern({cmd: 'get_all_movies'})
    async getAllMoviesByIds(ids: number[]) : Promise<Movie[]> {
        const result = await this.movieService.getAllMoviesByIds(ids);
        return result;
    }

    @Get('/:id')
    async getMovieById(@Param('id') id: number) {
        const result = await this.movieService.getMovieById(id);
        return result;
    }

    @Get('/:id/similar')
    async getSimilarById(@Param('id') id: number) {
        const result = await this.movieService.getSimilarByMovieID(id);
        return result;
    }

    @Put('/update/movie')
    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles('ADMIN')
    async updateMovie(@Body() dto: UpdateMovieDto) {
        const result = await this.movieService.updateMovie(dto);
        return result;
    }
}
