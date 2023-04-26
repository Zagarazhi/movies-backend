import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { RolesService } from 'src/roles/roles.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './users.model';
import { addRoleDto } from './dto/add-role.dto';

// работа с таблицей users, roles
@Injectable()
export class UsersService {

    // внедрение модели, параметром передаем саму модель
    // внедрение сервиса ролей пользователя
    constructor(@InjectModel(User) private userRepository: typeof User,
                private roleService: RolesService) {}

    // на вход приходит объект dto
    async createUser(dto: CreateUserDto) {
        const user = await this.userRepository.create(dto);
        // получение роли из базы данных
        const role = await this.roleService.getRoleByValue( 'USER') // ADMIN, USER
        await user.$set( 'roles', [role.id]) // set - метод перезаписать поле и обновить в бд
        user.roles = [role]
        return user;
    }

    // поле include значение по конкретным данным модели пользователя или для всех полей
    // пользователя
    async getAllUsers() {
        const users = await this.userRepository.findAll( {include: {all: true}});
        return users;
    }
    // проверка на наличие данного пользователя
    async getUserByEmail(email: string) {
        const user = await this.userRepository.findOne( {where: {email}, include: {all: true}})
        return user;
    }
    // функция выдать роль
    async addRole(dto: addRoleDto) {
        const user = await this.userRepository.findByPk(dto.userId);
        // получение роли из базы данных
        const role = await this.roleService.getRoleByValue(dto.value);
        if (role && user) {
            await user.$add( 'role', role.id); // добавление роли пользователю при помощи add
            // первый параметр 'role', второй - значение
            return dto;
        }
        throw new HttpException( 'Пользователь или роль не найдены', HttpStatus.NOT_FOUND);

    }
}
