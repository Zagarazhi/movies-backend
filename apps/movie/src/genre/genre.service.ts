import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Genre, UpdateGenreDto } from "@app/common";
import { CreateGenreDto } from "@app/common";

@Injectable()
export class GenreService {
    constructor(@InjectModel(Genre) private genreRepository: typeof Genre) {}

    async createGenre(dto: CreateGenreDto) {
        const genre = await this.genreRepository.create({nameRu: dto.genre});
        return genre;
    }

    async getAllGenres(): Promise<Genre[]> {
        const genres = await this.genreRepository.findAll();
        return genres;
    }

    async createOrFindGenres(genreDtos: CreateGenreDto[]): Promise<Genre[]> {
        const genres = [];
      
        for (const dto of genreDtos) {
            const [genre, created] = await this.genreRepository.findOrCreate({
                where: { nameRu: dto.genre },
                defaults: { nameRu: dto.genre },
            });
            genres.push(genre);
        }
        return genres;
    }

    async updateGenre(updateDto: UpdateGenreDto): Promise<Genre> {
        const genre = await this.genreRepository.update(updateDto, {where: {id: updateDto.id}, returning: true});
        return genre[1][0];
    }
}