import { Column, DataType, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import { Movie } from "@app/common";
import { Country } from "@app/common";

// Модель для создания связи многие ко многим у таблиц фильмов и стран
@Table({tableName: 'movies_countries', createdAt: false, updatedAt: false})
export class MovieCountry extends Model<MovieCountry> {

    @PrimaryKey
    @ForeignKey(() => Movie)
    @Column({type: DataType.INTEGER})
    movieId: number;

    @PrimaryKey
    @ForeignKey(() => Country)
    @Column({type: DataType.INTEGER})
    countryId: number;
}