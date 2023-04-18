import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Movie } from "./movie.model";

// Интефейс, в котором записаны поля, необходимые для создания объекта класса
interface VideoCreationAttrs {
    url: string;
    name: string;
    site: string;
    movieId: number;
}

// Модель для работы с таблицей жанров
@Table({tableName: 'videos', createdAt: false, updatedAt: false})
export class Video extends Model<Video, VideoCreationAttrs> {
    // Колонка id типа INTEGER, которая является первичным ключем таблицы
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    // Колонка названия, которая должна быть не пустой
    @Column({type: DataType.STRING, allowNull: false})
    name: string;

    // Колонка пути, которая должна быть не пустой
    @Column({type: DataType.STRING, allowNull: false})
    url: string;

    // Колонка типа видео, которая должна быть не пустой
    @Column({type: DataType.STRING, allowNull: false})
    site: string;

    // Связь с фильмами
    @ForeignKey(() => Movie)
    @Column({type: DataType.INTEGER, allowNull: false})
    movieId: number;

    @BelongsTo(() => Movie)
    movie: Movie;
}