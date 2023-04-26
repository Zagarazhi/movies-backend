import { ApiProperty } from "@nestjs/swagger/dist/decorators";
import { BelongsToMany, Column, DataType, Model, Table } from "sequelize-typescript";
import { User } from "src/users/users.model";
import { UserRoles } from "./user-roles.model";

// поля для создания объекта из класса Role, RoleCreationAttrs - generic
interface RoleCreationAttrs {
    value: string;
    description: string;
}

// модель сохранения ролей пользователя в бд
@Table( {tableName: 'roles'})
export class Role extends Model<Role, RoleCreationAttrs> {


    @ApiProperty( {example: '1', description: 'Уникальный идентификатор'})
    @Column( {type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ApiProperty( {example: 'ADMIN', description: 'Уникальное значение роли'})
    @Column( {type: DataType.STRING, unique: true, allowNull: false})
    value: string;

    @ApiProperty( {example: 'Администратор', description: 'Описание роли'})
    @Column( {type: DataType.STRING, allowNull: false})
    description: string;

    // связь пользователей и ролей через промежуточную таблицу
    @BelongsToMany( () => User, () => UserRoles) // UserRoles - таблица ролей
    users: User[];

    

} 