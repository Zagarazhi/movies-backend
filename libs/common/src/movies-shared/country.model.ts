import { BelongsToMany, Column, DataType, Model, Table } from "sequelize-typescript";
import { Movie } from "./movie.model";
import { MovieCountry } from "./movie-country.model";

// Интефейс, в котором записаны поля, необходимые для создания объекта класса
interface CountryCreationAttrs {
    nameRu: string;
    nameEn: string; 
}

// Модель для работы с таблицей стран
@Table({tableName: 'countries', createdAt: false, updatedAt: false})
export class Country extends Model<Country, CountryCreationAttrs> {
    // Колонка id типа INTEGER, которая является первичным ключем таблицы
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    // Колонка названия страны на русском, которая должна быть уникальной и не пустой
    @Column({type: DataType.STRING, unique: true, allowNull: false})
    nameRu: string;

    // Колонка названия страны на английском, которая должна быть уникальной
    @Column({type: DataType.STRING, unique: true})
    nameEn: string;

    // Связь многие ко многим с фильмами
    @BelongsToMany(() => Movie, () => MovieCountry)
    movies: Movie[];
}