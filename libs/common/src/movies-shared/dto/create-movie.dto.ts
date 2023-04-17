import { IsString, IsNumber, IsEnum, IsBoolean, ValidateNested } from "class-validator";
import { CreateGenreDto } from "./create-genre.dto";
import { CreateCountryDto } from "./create-country.dto";

enum TypesEnum {
    'FILM', 'VIDEO', 'TV_SERIES', 'MINI_SERIES', 'TV_SHOW'
}

// DTO-класс для создания фильма
export class CreateMovieDto {
    @IsNumber()
    kinopoiskId: number;
    @IsString()
    nameRu: string;
    @IsString()
    nameEn: string;
    @IsString()
    posterUrl: string;
    @IsString()
    posterUrlPreview: string;
    @IsString()
    coverUrl: string;
    @IsString()
    logoUrl: string;
    @IsNumber()
    ratingKinopoisk: number;
    @IsNumber()
    ratingKinopoiskVoteCount: number;
    @IsNumber()
    year: number;
    @IsNumber()
    filmLength: number;
    @IsString()
    slogan: string;
    @IsString()
    description: string;
    @IsString()
    shortDescription: string;
    @IsEnum(TypesEnum)
    type: string;
    @IsString()
    ratingMpaa: string;
    @IsString()
    ratingAgeLimits: string;
    @IsNumber()
    startYear: number;
    @IsNumber()
    endYear: number;
    @IsBoolean()
    serial: boolean;
    @IsBoolean()
    shortFilm: boolean;
    @IsBoolean()
    completed: boolean;
    @ValidateNested({each: true})
    countries: CreateCountryDto[];
    @ValidateNested({each: true})
    genres: CreateGenreDto[];
}