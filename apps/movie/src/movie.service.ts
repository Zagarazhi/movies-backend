import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Country, Genre, Movie, MovieCountry, MovieGenre, UpdateMovieDto } from "@app/common";
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

        for (const countryId of countries) {
            await MovieCountry.create({
                movieId: movie.id,
                countryId,
            });
        }
        for (const genreId of genres) {
            await MovieGenre.create({
                movieId: movie.id,
                genreId,
            });
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

    async getMovieById(id: number) {
        const movie = await this.movieRepository.findByPk(
            id, 
            {
                attributes: {
                    exclude: 
                        ['similarMoviesKinopoisk', 'createdAt', 'updatedAt']
                },
                include: [
                    {
                        model: Genre,
                        attributes: ['id', 'nameRu', 'nameEn'],
                        through: { attributes: [] },
                    },
                    {
                        model: Country,
                        attributes: ['id', 'nameRu', 'nameEn'],
                        through: { attributes: [] },
                    },
                ],
            }
        );
        return movie; 
    }

    async getAllMoviesByIds(ids: number[]) {
        const movies = await this.movieRepository.findAll({
            where: {id: {[Op.in]: ids}},
            attributes: [
                'id',
                'kinopoiskId',
                'nameRu',
                'nameEn',
                'ratingKinopoiskVoteCount',
                'ratingKinopoisk',
                'year',
                'filmLength',
                'type',
                'posterUrl',
                'posterUrlPreview',
            ],
        });
        return movies;
    }

    async getSimilarByMovieID(id: number) {
        const movies = await this.movieRepository.findAll({
            where: {id}, 
            include: {
                model: this.movieRepository,
                attributes: [
                    'id',
                    'kinopoiskId',
                    'nameRu',
                    'nameEn',
                    'ratingKinopoiskVoteCount',
                    'ratingKinopoisk',
                    'year',
                    'filmLength',
                    'type',
                    'posterUrl',
                    'posterUrlPreview',
                ],
                through: { attributes: [] },
                include: [
                    {
                        model: Genre,
                        attributes: ['id', 'nameRu', 'nameEn'],
                        through: { attributes: [] },
                    },
                    {
                        model: Country,
                        attributes: ['id', 'nameRu', 'nameEn'],
                        through: { attributes: [] },
                    },
                ],
            }, 
            attributes: [],
        });
        return movies[0].similarMovies;
    }

    async updateMovie(updateDto: UpdateMovieDto): Promise<Movie> {
        const movie = await this.movieRepository.update(updateDto, {where: {id: updateDto.id}, returning: true});
        return movie[1][0];
    }
}
