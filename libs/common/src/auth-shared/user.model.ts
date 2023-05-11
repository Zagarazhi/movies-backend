import { BelongsToMany, Column, DataType, Model, Table } from "sequelize-typescript";
import { Role } from "./role.model";
import { UserRoles } from "./user-role.model";

interface UserCreationAttrs {
    email: string;
    login: string;
    password?: string;
    refreshToken?: string
}

@Table( {tableName: 'users'})
export class User extends Model<User, UserCreationAttrs> {
    @Column( {type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true} )
    id: number;

    @Column( {type: DataType.STRING, unique: true, allowNull: false} )
    email: string;

    @Column( {type: DataType.STRING, unique: true, allowNull: false} )
    login: string;

    @Column( {type: DataType.STRING, allowNull: true} )
    password: string;

    @Column( {type: DataType.STRING} )
    refreshToken: string;

    @BelongsToMany( () => Role, () => UserRoles )
    roles: Role[];
} 