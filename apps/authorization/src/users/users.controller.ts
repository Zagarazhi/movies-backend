import { Body, Controller, Post, Get, UseGuards } from '@nestjs/common';
import { ApiResponse, ApiOperation } from '@nestjs/swagger/dist';
import { ApiTags } from '@nestjs/swagger/dist/decorators/api-use-tags.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './users.model';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles-auth.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { addRoleDto } from './dto/add-role.dto';

// создание, получение пользователей
@ApiTags( 'Пользователи') // обертка swagger
@Controller('users')
export class UsersController {

    constructor(private userService: UsersService) {} // внедрение

    @ApiOperation( {summary: 'Создание пользователя'})
    @ApiResponse( {status: 200, type: User})
    @Post()
    create(@Body() userDto: CreateUserDto) {
        return this.userService.createUser(userDto);
    } //dto получаем в теле запроса 

    @ApiOperation( {summary: 'Получить всех пользователей'})
    @ApiResponse( {status: 200, type: [User]})
    @Roles( 'ADMIN') // доступен для роли ADMIN
    @UseGuards(RolesGuard) //ограничение доступа
    @Get() //Get? Post?
    getAll() {
        return this.userService.getAllUsers();
    }
    

    @ApiOperation( {summary: 'Выдать роль'})
    @ApiResponse( {status: 200})
    @Roles( 'ADMIN') // доступен для роли ADMIN
    @UseGuards(RolesGuard) //ограничение доступа
    @Post( '/role')
    // функция выдать роль
    addRole(@Body() dto: addRoleDto) {
        return this.userService.addRole(dto);
    }
}
