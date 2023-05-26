import { Body, Controller, Get, Put, UseGuards } from "@nestjs/common";
import { MessagePattern } from "@nestjs/microservices";
import { AccessTokenGuard, Genre, Roles, RolesGuard, UpdateGenreDto } from "@app/common";
import { CreateGenreDto } from "@app/common";
import { GenreService } from "./genre.service";

@Controller('/movies')
export class GenreController {
    constructor(private genreService: GenreService) {}

    @MessagePattern({cmd: 'country'})
    async createCountry(data: CreateGenreDto) : Promise<Genre> {
        return this.genreService.createGenre(data);
    }

    @Get('/filters/genres')
    async getAllGenres(): Promise<Genre[]> {
        return this.genreService.getAllGenres();
    }

    @Put('/update/genre')
    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles('ADMIN')
    async updateMovie(@Body() dto: UpdateGenreDto) {
        const result = await this.genreService.updateGenre(dto);
        return result;
    }
}