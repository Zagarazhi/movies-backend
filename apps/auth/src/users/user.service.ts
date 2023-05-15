import { CreateUserDto, Role, User, UserRoles } from "@app/common";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { RoleService } from "../roles/role.service";

@Injectable()
export class UserService {
    constructor(@InjectModel(User) private userRepository: typeof User,
            private roleService: RoleService) {}

    async create(createUserDto: CreateUserDto): Promise<User> {
        const user = await this.userRepository.create(createUserDto);
        const role = await this.roleService.getRoleByValue('USER');
        await user.$set('roles', [role?.id]);
        // При создании пользователя функция $set добавляет роль к записи в БД,
        // однако чтобы добавить роль в объект, необходима следующая строчка
        user.roles = [role];
        return user;
    }

    async externalCreate(login: string, email: string): Promise<User> {
        const user = await this.userRepository.create({login, email});
        const role = await this.roleService.getRoleByValue('USER');
        await user.$set('roles', [role?.id]);
        // При создании пользователя функция $set добавляет роль к записи в БД,
        // однако чтобы добавить роль в объект, необходима следующая строчка
        user.roles = [role];
        return user;
    }
    
    async update(id: number, createUserDto: any): Promise<User> {
        const result = await this.userRepository.update(createUserDto, {where: {id}, returning: true});
        const user = result[1][0];
        return user;
    }

    async findById(id: number): Promise<User> {
        const user = await this.userRepository.findByPk(id, {include: {all: true}});
        return user;
    }

    async getInfoById(id: number): Promise<User> {
        const user = await this.userRepository.findByPk(
            id,
            {
                attributes:  ['login', 'email'],
                include: [
                    {
                        model: Role,
                        attributes:  ['value'],
                        through: {
                            attributes: [],
                        }
                    },
                ],
            },
        );
        return user;
    }

    async findByUsername(login: string): Promise<User> {
        const user = this.userRepository.findOne({where: {login}, include: {all: true}});
        return user;
    }
}