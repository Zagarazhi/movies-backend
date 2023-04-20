import { CreateUserDto } from './dto/create-user.dto';
import { User } from './users.model';
import { UsersService } from './users.service';
import { addRoleDto } from './dto/add-role.dto';
export declare class UsersController {
    private userService;
    constructor(userService: UsersService);
    create(userDto: CreateUserDto): Promise<User>;
    getAll(): Promise<User[]>;
    addRole(dto: addRoleDto): Promise<addRoleDto>;
}
