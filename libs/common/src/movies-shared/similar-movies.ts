import { Column, DataType, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import { Movie } from "@app/common";

// Модель для создания связи многие ко многим у таблиц фильмов и жанров
@Table({tableName: 'similar_movies', createdAt: false, updatedAt: false})
export class SimilarMovies extends Model<SimilarMovies> {

    @PrimaryKey
    @ForeignKey(() => Movie)
    @Column({type: DataType.INTEGER})
    movieId: number;

    @PrimaryKey
    @ForeignKey(() => Movie)
    @Column({type: DataType.INTEGER})
    similarTo: number;
}