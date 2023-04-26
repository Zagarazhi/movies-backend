import { Body, Controller, Get, Post, Param } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { RolesService } from './roles.service';

// точки входа:
@Controller('roles')
export class RolesController {
    constructor(private roleService: RolesService) {} // внедрение зависимостей

    @Post() // декоратор для post запроса
    create(@Body() dto: CreateRoleDto) {
        return this.roleService.createRole(dto);
    }

    @Get( '/:value') // декоратор @Param для динамически изменяемого участка пути
    getByValue(@Param( 'value') value: string) {
        return this.roleService.getRoleByValue(value);

    }
}
