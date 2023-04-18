import { Controller } from '@nestjs/common';
import { MovieService } from './movie.service';
import { MessagePattern } from "@nestjs/microservices";
import { CreateMovieDto } from "@app/common";
import { Movie } from "@app/common";

@Controller()
export class MovieController {
    constructor(private readonly movieService: MovieService) {}

    @MessagePattern({cmd: 'movie'})
    async createMovie(data: CreateMovieDto) : Promise<Movie> {
        const result = await this.movieService.createMovie(data);
        return result;
    }
}
