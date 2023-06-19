import { AccessTokenGuard, CreateRoleDto, Roles, RolesGuard } from '@app/common';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { RoleService } from './role.service';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiOperation } from '@nestjs/swagger';

// Генарация контроллера
// nest generate controller roles
@Controller('roles')
export class RoleController {

    // Инъекция зависимости
    constructor(private roleService: RoleService) {}

    // Эндпоинты
    @ApiOperation({ summary: 'Создание роли' })
    @ApiBearerAuth()
    @ApiCreatedResponse({ description: 'Роль успешно создана' })
    @ApiBody({
        type: CreateRoleDto,
            examples: {
                example1: {
                value: {
                    value: 'АДМИН',
                    description: 'Великий и ужасный',
                },
                summary: 'Пример создания роли',
                },
            },
    })
    @Post()
    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles('ADMIN')
    create(@Body() dto: CreateRoleDto) {
        return this.roleService.createRole(dto);
    }
}
