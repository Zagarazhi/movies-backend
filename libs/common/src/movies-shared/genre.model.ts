import { BelongsToMany, Column, DataType, Model, Table } from "sequelize-typescript";
import { Movie } from "./movie.model";
import { MovieGenre } from "../../../../apps/movie/src/genre/movie-genre.model";

// Интефейс, в котором записаны поля, необходимые для создания объекта класса
interface GenreCreationAttrs {
    nameRu: string;
    nameEn: string; 
}

// Модель для работы с таблицей жанров
@Table({tableName: 'genres', createdAt: false, updatedAt: false})
export class Genre extends Model<Genre, GenreCreationAttrs> {
    // Колонка id типа INTEGER, которая является первичным ключем таблицы
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    // Колонка названия жанра на русском, которая должна быть уникальной и не пустой
    @Column({type: DataType.STRING, unique: true, allowNull: false})
    nameRu: string;

    // Колонка названия жанра на английском, которая должна быть уникальной
    @Column({type: DataType.STRING, unique: true})
    nameEn: string;

    // Связь многие ко многим с фильмами
    @BelongsToMany(() => Movie, () => MovieGenre)
    movies: Movie[];
}