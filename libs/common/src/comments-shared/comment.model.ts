import { BelongsTo, BelongsToMany, Column, DataType, Default, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";

// Интефейс, в котором записаны поля, необходимые для создания объекта класса
interface CommentCreationAttrs {
    type: string;
    date: Date;
    author: string;
    title: string;
    description: string;
    movieId: number;
    userId?: number;
    repliedOnComment?: number;
}

// Модель для работы с таблицей комментариев
@Table({tableName: 'comments'})
export class Comment extends Model<Comment, CommentCreationAttrs> {
    // Колонка id типа INTEGER, которая является первичным ключем таблицы
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;
    
    @Column(DataType.ENUM('POSITIVE', 'NEUTRAL', 'NEGATIVE'))
    type: string;

    @Column(DataType.DATE)
    date: Date

    @Column(DataType.STRING)
    author: string;

    @Column(DataType.STRING)
    title: string;

    @Column(DataType.TEXT)
    description: string;

    @Column(DataType.INTEGER)
    movieId: number;

    @Column(DataType.INTEGER)
    userId: number;

    @ForeignKey(() => Comment)
    @Column(DataType.INTEGER)
    repliedOnComment: number;

    @BelongsTo(() => Comment, { foreignKey: 'repliedOnComment' })
    parent: Comment;

    @HasMany(() => Comment, { foreignKey: 'repliedOnComment' })
    replies: Comment[];
}