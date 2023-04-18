import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from "@nestjs/microservices";
import axios from 'axios';
import { CreateMovieDto, Movie } from '@app/common';

@Injectable()
export class ParserService {

    constructor(@Inject('MOVIE_SERVICE') private client: ClientProxy) {}

    private async createMovieDtoFromJson(json: any, videos: any, posters: any, similar: any): Promise<CreateMovieDto> {
        const movieDto: CreateMovieDto = {
            kinopoiskId: json.kinopoiskId,
            nameRu: json.nameRu,
            nameEn: json.nameEn || json.nameOriginal,
            posterUrl: posters ? posters[0].imageUrl : null,
            posterUrlPreview: posters ? posters[0].previewUrl : null,
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

    async parseMovie(id: number) {
        const headers = { 'X-API-KEY': process.env.API_KINOPOISK };
        const config = { headers };
        const response = await axios.get(`https://kinopoiskapiunofficial.tech/api/v2.2/films/${id}`, config);
        const videos = await axios.get(`https://kinopoiskapiunofficial.tech/api/v2.2/films/${id}/videos`, config);
        const posters = await axios.get(`https://kinopoiskapiunofficial.tech/api/v2.2/films/${id}/images?type=POSTER&page=1`, config);
        const similar = await axios.get(`https://kinopoiskapiunofficial.tech/api/v2.2/films/${id}/similars`, config);
        const payload = await this.createMovieDtoFromJson(response.data, videos.data, posters.data.items, similar.data.items);
        const pattern = { cmd: 'movie' };
        const result = this.client.send<void | Movie>(pattern, payload);
        return result;
    }
}
