import { Body, Controller, Get, Put, UseGuards } from "@nestjs/common";
import { MessagePattern } from "@nestjs/microservices";
import { AccessTokenGuard, Genre, Roles, RolesGuard, UpdateGenreDto } from "@app/common";
import { CreateGenreDto } from "@app/common";
import { GenreService } from "./genre.service";
import { ApiBody, ApiOkResponse, ApiOperation } from "@nestjs/swagger";

@Controller('/movies')
export class GenreController {
    constructor(private genreService: GenreService) {}

    @MessagePattern({cmd: 'country'})
    async createCountry(data: CreateGenreDto) : Promise<Genre> {
        return this.genreService.createGenre(data);
    }

    @ApiOperation({ summary: 'Получить все жанры' })
    @ApiOkResponse({ description: 'Жанры успешно получены' })
    @Get('/filters/genres')
    async getAllGenres(): Promise<Genre[]> {
        return this.genreService.getAllGenres();
    }

    @ApiOperation({ summary: 'Обновить жанр' })
    @ApiBody({
        type: UpdateGenreDto,
            examples: {
                example1: {
                value: {
                    id: 1,
                    nameRu: "фантастика",
                    nameEn: "fantastic",
                },
                summary: 'Пример обновления жанра',
                },
            },
    })
    @ApiOkResponse({ description: 'Страна успешно обновлена' })
    @Put('/update/genre')
    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles('ADMIN')
    async updateMovie(@Body() dto: UpdateGenreDto) {
        const result = await this.genreService.updateGenre(dto);
        return result;
    }
}