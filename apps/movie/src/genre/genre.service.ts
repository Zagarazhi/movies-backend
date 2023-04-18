import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Genre } from "@app/common";
import { CreateGenreDto } from "@app/common";

@Injectable()
export class GenreService {
    constructor(@InjectModel(Genre) private genreRepository: typeof Genre) {}

    async createGenre(dto: CreateGenreDto) {
        const country = await this.genreRepository.create({nameRu: dto.genre});
        return country;
    }

    async createOrFindGenres(genreDtos: CreateGenreDto[]): Promise<Genre[]> {
        const genres = [];
      
        for (const dto of genreDtos) {
            const [genre, created] = await this.genreRepository.findOrCreate({
                where: { nameRu: dto.genre },
                defaults: { nameRu: dto.genre },
            });
        
            if (!created) {
                genres.push(genre);
            } else {
                genres.push(genre[0]);
            }
        }
      
        return genres;
    }
}