import { Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Role } from "./role.model";
import { User } from "./user.model";

@Table( {tableName: 'user_roles', createdAt: false, updatedAt: false} )
export class UserRoles extends Model<UserRoles> {
    @ForeignKey( () => Role )
    @Column( {type: DataType.INTEGER, primaryKey: true} )
    roleId: number;

    @ForeignKey( () => User )
    @Column( {type: DataType.INTEGER, primaryKey: true} )
    userId: number;
} 