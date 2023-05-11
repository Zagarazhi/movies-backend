import { CreateRoleDto, Role } from '@app/common';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
// Генарация сервиса
// nest generate service roles
@Injectable()
export class RoleService {

    // Инъекция зависимости модели
    // Объект создает сам Нест
    constructor(@InjectModel(Role) private roleRepository: typeof Role) {}

    // Создание роли
    async createRole(dto: CreateRoleDto) {
        const role = await this.roleRepository.create(dto);
        return role;
    }

    // Получение роли по названию
    async getRoleByValue(value: string) {
        const role = await this.roleRepository.findOne({where: {value}});
        return role;
    }
}
