import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { MovieService } from './movie.service';
import { MessagePattern } from "@nestjs/microservices";
import { AccessTokenGuard, CreateMovieDto, Roles, RolesGuard, UpdateMovieDto } from "@app/common";
import { Movie } from "@app/common";
import { ApiBody, ApiOkResponse, ApiOperation, ApiParam } from '@nestjs/swagger';

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

    @ApiOperation({ summary: 'Получение фильма по ID' })
    @ApiParam({ name: 'id', type: 'number' })
    @Get('/:id')
    @Get('/:id')
    async getMovieById(@Param('id') id: number) {
        const result = await this.movieService.getMovieById(id);
        return result;
    }

    @ApiOperation({ summary: 'Получение похожих фильмов по ID' })
    @ApiParam({ name: 'id', type: 'number' })
    @Get('/:id/similar')
    async getSimilarById(@Param('id') id: number) {
        const result = await this.movieService.getSimilarByMovieID(id);
        return result;
    }

    @ApiOperation({ summary: 'Обновление фильма' })
    @ApiBody({
        type: UpdateMovieDto,
            examples: {
                example1: {
                value: {
                    id: 1,
                    nameRu: "Матрица",
                    nameEn: "The Matrix",
                },
                summary: 'Пример обновления филмьа',
                },
            },
    })
    @ApiOkResponse({ description: 'Фильм успешно обновлен' })
    @Put('/update/movie')
    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles('ADMIN')
    async updateMovie(@Body() dto: UpdateMovieDto) {
        const result = await this.movieService.updateMovie(dto);
        return result;
    }
}
