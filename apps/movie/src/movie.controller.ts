import { Controller, Get, Param } from '@nestjs/common';
import { MovieService } from './movie.service';
import { MessagePattern } from "@nestjs/microservices";
import { CreateMovieDto } from "@app/common";
import { Movie } from "@app/common";

@Controller('/movies')
export class MovieController {
    constructor(private readonly movieService: MovieService) {}

    @MessagePattern({cmd: 'movie'})
    async createMovie(data: CreateMovieDto) : Promise<void | Movie> {
        const result = await this.movieService.createMovie(data);
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
}
