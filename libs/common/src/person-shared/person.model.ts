import { Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import { RoleInfo } from "./role-info.model";

// Интефейс, в котором записаны поля, необходимые для создания объекта класса
interface PersonCreationAttrs {
    staffId: number;
    nameRu: string;
    nameEn: string;
    posterUrl: string;
}

// Модель для работы с таблицей людей
@Table({tableName: 'persons', createdAt: false, updatedAt: false})
export class Person extends Model<Person, PersonCreationAttrs> {
    // Колонка id типа INTEGER, которая является первичным ключем таблицы
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    // Колонка имени на русском
    @Column({type: DataType.STRING})
    nameRu: string;

    // Колонка имени на английском
    @Column({type: DataType.STRING})
    nameEn: string;
    
    // Колонка id на кинопоиске
    @Column(DataType.INTEGER)
    staffId: number;

    // Колонка ссылки на фотографиию
    @Column(DataType.STRING)
    posterUrl: string;

    // Роли человека в фильмах
    @HasMany(() => RoleInfo)
    roles: RoleInfo[];
}