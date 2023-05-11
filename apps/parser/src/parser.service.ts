import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from "@nestjs/microservices";
import axios from 'axios';
import { CreateCommentDto, CreateMovieDto, CreatePersonDto, CreateRoleInfoDto, Movie, Person } from '@app/common';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class ParserService {

    constructor(@Inject('MOVIE_SERVICE') private movieClient: ClientProxy,
                @Inject('COMMENT_SERVICE') private commentClient: ClientProxy,
                @Inject('PERSON_SERVICE') private personClient: ClientProxy, ) {}

    private createMovieDtoFromJson(json: any, videos: any, similar: any): CreateMovieDto {
        const movieDto: CreateMovieDto = {
            kinopoiskId: json.kinopoiskId,
            nameRu: json.nameRu,
            nameEn: json.nameEn || json.nameOriginal,
            posterUrl: json.posterUrl,
            posterUrlPreview: json.posterUrlPreview,
            coverUrl: json.coverUrl,
            logoUrl: json.logoUrl,
            ratingKinopoisk: json.ratingKinopoisk,
            ratingKinopoiskVoteCount: json.ratingKinopoiskVoteCount,
            year: json.year,
            filmLength: json.filmLength,
            slogan: json.slogan,
            description: json.description,
            shortDescription: json.shortDescription,
            type: json.type,
            ratingMpaa: json.ratingMpaa,
            ratingAgeLimits: json.ratingAgeLimits,
            startYear: json.startYear,
            endYear: json.endYear,
            serial: json.serial,
            shortFilm: json.shortFilm,
            completed: json.completed,
            countries: json.countries.map((c: any) => ({ country: c.country })),
            genres: json.genres.map((g: any) => ({ genre: g.genre })),
            videos: videos.items,
            similarMoviesKinopoisk: similar.map((m: any) => m.filmId),
        };
        
        return movieDto;
    }

    private createCommentsFromJson(json: any, movieId: number) {
        const comments = [];
        for(const item of json) {
            const comment: CreateCommentDto = {
                type: item.type,
                date: item.date,
                author: item.author,
                title: item.title,
                description: item.description,
                movieId,
            }
            comments.push(comment);
        }
        return comments;
    }

    private createPersonsFromJson(json: any, movieId: number) {
        const persons = [];
        for(const item of json) {
            const person: CreatePersonDto = {
                nameRu: item.nameRu,
                nameEn: item.nameEn,
                staffId: item.staffId,
                posterUrl: item.posterUrl,
                role: {
                    movieId,
                    nameRu: item.professionText,
                    nameEn: item.professionKey.charAt(0).toUpperCase() + item.professionKey.slice(1).toLowerCase() + 's',
                    description: item.description,
                },
            };
            persons.push(person);
        }
        return persons;
    }

    async parseMovie(id: number) {
        const headers = { 'X-API-KEY': process.env.API_KINOPOISK };
        const config = { headers };

        const response = await axios.get(`https://kinopoiskapiunofficial.tech/api/v2.2/films/${id}`, config);
        const videos = await axios.get(`https://kinopoiskapiunofficial.tech/api/v2.2/films/${id}/videos`, config);
        const similar = await axios.get(`https://kinopoiskapiunofficial.tech/api/v2.2/films/${id}/similars`, config);
        const comments = await axios.get(`https://kinopoiskapiunofficial.tech/api/v2.2/films/${id}/reviews?page=1&order=DATE_DESC`, config);
        const persons = await axios.get(`https://kinopoiskapiunofficial.tech/api/v1/staff?filmId=${id}`, config);

        const payload = this.createMovieDtoFromJson(response.data, videos.data, similar.data.items);
        const pattern = { cmd: 'movie' };
        const result = await lastValueFrom(this.movieClient.send<Movie>(pattern, payload));
        
        const addedComments = await lastValueFrom(this.commentClient.send<Comment[]>({cmd: 'comment'}, this.createCommentsFromJson(comments.data.items, result.id)));
        const addedPersons = await lastValueFrom(this.personClient.send<Person[]>({cmd: 'person'}, this.createPersonsFromJson(persons.data, result.id)));

        return result;
    }
}
