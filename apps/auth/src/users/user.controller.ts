import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { Request } from 'express';
import {
    ApiTags,
    ApiOperation,
    ApiBearerAuth,
    ApiOkResponse,
} from '@nestjs/swagger';
import { AccessTokenGuard, Roles, RolesGuard } from "@app/common";

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @ApiOperation({ summary: 'Получение информации о пользователе' })
    @ApiBearerAuth()
    @ApiOkResponse({ description: 'Информация успешно получена' })
    @UseGuards(AccessTokenGuard)
    @Get('/info')
    async getInfo(@Req() req: Request) {
        const userId = req.user['sub'];
        const user = await this.userService.getInfoById(userId);
        return user;
    }

    @ApiOperation({ summary: 'Проверка, является ли пользователь админом' })
    @ApiBearerAuth()
    @ApiOkResponse({ description: 'Возвращает true если админ' })
    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles('ADMIN')
    @Get('/isadmin')
    async isAdmin() {
        return true;
    }
}