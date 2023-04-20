import { ApiProperty } from "@nestjs/swagger/dist/decorators";
import { BelongsToMany, Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
//import { Post } from "src/posts/posts.model";
import { Role } from "src/roles/roles.model";
import { UserRoles } from "src/roles/user-roles.model";

// поля для создания объекта из класса User, UserCreationAttrs - generic
interface UserCreationAttrs {
    email: string;
    password: string;
}

// модель сохранения пользователя в бд
@Table( {tableName: 'users'})
export class User extends Model<User, UserCreationAttrs> {
    @ApiProperty( {example: '1', description: 'Уникальный идентификатор'})
    //поля - колонки
    @Column( {type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ApiProperty( {example: 'user@mail.ru', description: 'Почтовый адрес'})
    @Column( {type: DataType.STRING, unique: true, allowNull: false})
    email: string;

    @ApiProperty( {example: '1234', description: 'Пароль'})
    @Column( {type: DataType.STRING, allowNull: false})
    password: string;

    @ApiProperty( {example: 'true', description: 'Забанен или нет'})
    @Column( {type: DataType.BOOLEAN, defaultValue: false})
    banned: boolean;

    @ApiProperty( {example: 'Причина', description: 'Причина блокировки'})
    @Column( {type: DataType.STRING, allowNull: true})
    banReason: string;

    // связь пользователей и ролей через промежуточную таблицу
    @BelongsToMany( () => Role, () => UserRoles) //UserRoles - таблица
    roles: Role[];

    //@HasMany( () => Post)
    //posts: Post[];

} 