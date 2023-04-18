import { Controller } from "@nestjs/common";
import { MessagePattern } from "@nestjs/microservices";
import { Genre } from "@app/common";
import { CreateGenreDto } from "@app/common";
import { GenreService } from "./genre.service";

@Controller('/movies/genries')
export class GenreController {
    constructor(private genreService: GenreService) {}

    @MessagePattern({cmd: 'country'})
    async createCountry(data: CreateGenreDto) : Promise<Genre> {
        return this.genreService.createGenre(data);
    }
}