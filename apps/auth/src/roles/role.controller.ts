import { AccessTokenGuard, CreateRoleDto, Roles, RolesGuard } from '@app/common';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { RoleService } from './role.service';

// Генарация контроллера
// nest generate controller roles
@Controller('roles')
export class RoleController {

    // Инъекция зависимости
    constructor(private roleService: RoleService) {}

    // Эндпоинты

    @Post()
    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles('ADMIN')
    create(@Body() dto: CreateRoleDto) {
        return this.roleService.createRole(dto);
    }
}
