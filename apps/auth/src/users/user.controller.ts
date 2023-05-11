import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { Request } from 'express';
import { AccessTokenGuard, Roles, RolesGuard } from "@app/common";

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @UseGuards(AccessTokenGuard)
    @Get('/info')
    async getInfo(@Req() req: Request) {
        const userId = req.user['sub'];
        const user = await this.userService.getInfoById(userId);
        return user;
    }

    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles('ADMIN')
    @Get('/isadmin')
    async isAdmin() {
        return true;
    }
}