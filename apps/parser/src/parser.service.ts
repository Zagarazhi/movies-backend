import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from "@nestjs/microservices";
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { createWriteStream } from 'fs';
import * as fs from 'fs';
import { promisify } from 'util';
import { CreateMovieDto, Movie } from '@app/common';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class ParserService {

    constructor(@Inject('MOVIE_SERVICE') private client: ClientProxy) {}

    private async downloadImage(url: string, folderPath: string): Promise<string> {
        const uniqueId = uuidv4();
        const fileExtension = url.split('.').pop();
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
        }
        const fileName = `${uniqueId}.${fileExtension}`;
        const filePath = `${folderPath}/${fileName}`;
      
        const response = await axios.get(url, { responseType: 'stream' });
        if (response.status !== 200) {
            throw new Error(`Failed to download image: ${response.status}`);
        }
      
        await promisify(response.data.pipe.bind(response.data))(createWriteStream(filePath));
      
        return filePath;
    }

    private async createMovieDtoFromJson(json: any): Promise<CreateMovieDto> {
        const movieDto: CreateMovieDto = {
            kinopoiskId: json.kinopoiskId,
            nameRu: json.nameRu,
            nameEn: json.nameEn || json.nameOriginal,
            posterUrl: json.posterUrl,// ? await this.downloadImage(json.posterUrl, '/static/posters') : null,
            posterUrlPreview: json.posterUrlPreview,// ? await this.downloadImage(json.posterUrlPreview, '/static/posters') : null,
            coverUrl: json.coverUrl,// ? await this.downloadImage(json.coverUrl, '/static/covers') : null,
            logoUrl: json.logoUrl,// ? await this.downloadImage(json.logoUrl, '/static/logos') : null,
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
            genres: json.genres.map((g: any) => ({ genre: g.genre }))
        };
        
        return movieDto;
    }

    async parseMovie(id: number) {
        const headers = { 'X-API-KEY': '63cf78a3-b097-46c9-a3d2-4e33a123727a' };
        const config = { headers };
        const response = await axios.get(`https://kinopoiskapiunofficial.tech/api/v2.2/films/${id}`, config);
        const payload = await this.createMovieDtoFromJson(response.data);
        const pattern = { cmd: 'movie' };
        const result = await lastValueFrom(this.client.send<Movie>(pattern, payload));
        return result;
    }
}
