import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateRoleDto } from './dto/create-role.dto';
import { Role } from './roles.model';

// работа с таблицей roles
@Injectable()
export class RolesService {

    // внедрение модели, для возможности записи в таблицу, параметр сама модель
    constructor(@InjectModel(Role) private roleRepository: typeof Role) {}

    // dto для создания ролей
    async createRole(dto: CreateRoleDto) { 
        const role = await this.roleRepository.create(dto);
        return role;

    }

    async getRoleByValue(value: string) {
        const role = await this.roleRepository.findOne( {where: {value}})
        return role;
    }
}
