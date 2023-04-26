//import { ApiProperty } from "@nestjs/swagger/dist/decorators";
import { BelongsToMany, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { User } from "src/users/users.model";
import { Role } from "./roles.model";


// таблица связи пользователей и ролей
@Table( {tableName: 'user_roles', createdAt: false, updatedAt: false})
export class UserRoles extends Model<UserRoles> {

    
    @Column( {type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ForeignKey( () => Role)
    @Column( {type: DataType.INTEGER})
    roleId: number; // внешний ключ

    @ForeignKey( () => User)
    @Column( {type: DataType.INTEGER})
    userId: number; // внешний ключ
    

} 