import { BelongsToMany, Column, DataType, Model, Table } from "sequelize-typescript";
import { Country } from "./country.model";
import { MovieCountry } from "../../../../apps/movie/src/country/movie-country.model";
import { Genre } from "./genre.model";
import { MovieGenre } from "../../../../apps/movie/src/genre/movie-genre.model";

// Интефейс, в котором записаны поля, необходимые для создания объекта класса
interface MovieCreationAttrs {
    kinopoiskId: number;
    nameRu: string;
    nameEn: string;
    posterUrl: string;
    posterUrlPreview: string;
    coverUrl: string;
    logoUrl: string;
    ratingKinopoisk: number;
    ratingKinopoiskVoteCount: number;
    year: number;
    filmLength: number;
    slogan: string;
    description: string;
    shortDescription: string;
    type: string;
    ratingMpaa: string;
    ratingAgeLimits: string;
    startYear: number;
    endYear: number;
    serial: boolean;
    shortFilm: boolean;
    completed: boolean;
    countries: number[];
    genres: number[];
}

// Модель для работы с таблицей фильмов
@Table({tableName: 'movies'})
export class Movie extends Model<Movie, MovieCreationAttrs> {
    // Колонка id типа INTEGER, которая является первичным ключем таблицы
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;
    
    // id с сайта Кинопоиск
    @Column({type: DataType.INTEGER, unique: true})
    kinopoiskId: number;

    // Колонка названия фильма на русском, которая должна быть уникальной и не пустой
    @Column({type: DataType.STRING, unique: true, allowNull: false})
    nameRu: string;

    // Колонка названия фильма на английском, которая должна быть уникальной
    @Column({type: DataType.STRING, unique: true})
    nameEn: string;

    @Column({type: DataType.STRING})
    posterUrl: string;

    @Column({type: DataType.STRING})
    posterUrlPreview: string;

    @Column({type: DataType.STRING})
    coverUrl: string;

    @Column({type: DataType.STRING})
    logoUrl: string;

    @Column({type: DataType.DOUBLE})
    ratingKinopoisk: number;

    @Column({type: DataType.DOUBLE})
    ratingKinopoiskVoteCount: number;

    @Column({type: DataType.INTEGER})
    year: number;

    @Column({type: DataType.INTEGER})
    filmLength: number;

    @Column({type: DataType.STRING})
    slogan: string;

    @Column({type: DataType.STRING})
    description: string;

    @Column({type: DataType.STRING})
    shortDescription: string;

    @Column({type: DataType.ENUM('FILM', 'VIDEO', 'TV_SERIES', 'MINI_SERIES', 'TV_SHOW')})
    type: string;

    @Column({type: DataType.STRING})
    ratingMpaa: string;

    @Column({type: DataType.STRING})
    ratingAgeLimits: string;

    @Column({type: DataType.INTEGER})
    startYear: number;

    @Column({type: DataType.INTEGER})
    endYear: number;

    @Column({type: DataType.BOOLEAN})
    serial: boolean;

    @Column({type: DataType.BOOLEAN})
    shortFilm: boolean;

    @Column({type: DataType.BOOLEAN})
    completed: boolean;

    // Связь многие ко многие со странами
    @BelongsToMany(() => Country, () => MovieCountry)
    countries: Country[];

    // Связь многие ко многие с жанрами
    @BelongsToMany(() => Genre, () => MovieGenre)
    genries: Genre[];
}