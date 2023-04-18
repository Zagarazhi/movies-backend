import { Column, DataType, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import { Movie } from "@app/common";
import { Genre } from "@app/common";

// Модель для создания связи многие ко многим у таблиц фильмов и жанров
@Table({tableName: 'movies_genres', createdAt: false, updatedAt: false})
export class MovieGenre extends Model<MovieGenre> {

    @PrimaryKey
    @ForeignKey(() => Movie)
    @Column({type: DataType.INTEGER})
    movieId: number;

    @PrimaryKey
    @ForeignKey(() => Genre)
    @Column({type: DataType.INTEGER})
    genreId: number;
}