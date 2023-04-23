import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { Person } from "./person.model";

// Интефейс, в котором записаны поля, необходимые для создания объекта класса
interface RoleInfoCreationAttrs {
    personId: number;
    movieId: number;
    nameRu: string;
    nameEn: string;
    description?: string;
}

// Модель для работы с таблицей ролей в фильмах
@Table({tableName: 'roleinfos', createdAt: false, updatedAt: false})
export class RoleInfo extends Model<RoleInfo, RoleInfoCreationAttrs> {
    // Колонка id типа INTEGER, которая является первичным ключем таблицы
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    // Внешний ключ для связи с человеком
    @ForeignKey(() => Person)
    @Column(DataType.INTEGER)
    personId: number;

    @BelongsTo(() => Person)
    person: Person;

    // id фильма
    @Column(DataType.INTEGER)
    movieId: number;

    // Колонка названия роли на русском
    @Column(DataType.STRING)
    nameRu: string;

    // Колонка названия роли на английском
    @Column(DataType.STRING)
    nameEn: string;

    // Описаниние роли
    @Column(DataType.STRING)
    description: string;
}