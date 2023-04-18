import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Movie } from "@app/common";
import { CountryService } from './country/country.service';
import { GenreService } from './genre/genre.service';
import { CreateMovieDto } from "@app/common";

@Injectable()
export class MovieService {
    constructor(@InjectModel(Movie) private movieRepository: typeof Movie,
                private countryService: CountryService,
                private genreService: GenreService) {}

    async createMovie(dto: CreateMovieDto) {
        const countries: number[] = (await this.countryService.createOrFindCountries(dto.countries)).map(c => c.id);
        const genres: number[] = (await this.genreService.createOrFindGenres(dto.genres)).map(g => g.id);
        const movie = this.movieRepository.create({...dto, countries, genres});
        return movie;
    }
}
