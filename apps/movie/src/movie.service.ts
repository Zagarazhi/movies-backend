import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Movie } from "@app/common";
import { CountryService } from './country/country.service';
import { GenreService } from './genre/genre.service';
import { CreateMovieDto } from "@app/common";
import { VideoService } from './video/video.service';
import { Op } from 'sequelize';

@Injectable()
export class MovieService {
    constructor(@InjectModel(Movie) private movieRepository: typeof Movie,
                private countryService: CountryService,
                private genreService: GenreService,
                private videoService: VideoService,) {}

    async createMovie(dto: CreateMovieDto) {
        const [countriesResult, genresResult, similarMoviesResult] = await Promise.all([
            this.countryService.createOrFindCountries(dto.countries),
            this.genreService.createOrFindGenres(dto.genres),
            this.movieRepository.findAll({
                where: {
                    kinopoiskId: dto.similarMoviesKinopoisk,
                },
            }),
        ]);
        
        const countries = countriesResult.map(c => c.id);
        const genres = genresResult.map(g => g.id);
        
        let movie = await this.movieRepository.findOne({
            where: {
                kinopoiskId: dto.kinopoiskId,
            },
        });
        
        if (!movie) {
            movie = await this.movieRepository.create({...dto, countries, genres});
        } else {
            return movie;
        }
    
        for (const similarMovie of similarMoviesResult) {
            await movie.$add('similarMovies', similarMovie);
        }
        
        const similarToMovies = await Movie.findAll({
            where: {
                similarMoviesKinopoisk: {
                [Op.contains]: [movie.kinopoiskId],
                },
            },
        });
        
        for (const similarToMovie of similarToMovies) {
            await similarToMovie.$add('similarMovies', movie);
        }
        
        const videos = await this.videoService.createAll(dto.videos, movie.id);
    
        return movie;
    }
}
