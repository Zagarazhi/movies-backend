import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request } from 'express';
import {
    ApiTags,
    ApiOperation,
    ApiBearerAuth,
    ApiOkResponse,
    ApiBody,
} from '@nestjs/swagger';
import { AccessTokenGuard, AuthDto, CreateUserDto, RefreshTokenGuard } from '@app/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('/auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @ApiOperation({ summary: 'Аутентификация Гугл' })
    @ApiOkResponse({ description: 'Аутентификация инициализирована' })
    @Get('/google')
    @UseGuards(AuthGuard('google'))
    async googleAuth(@Req() req) {}
  
    @ApiOperation({ summary: 'Перенаправление аутентификации Гугл' })
    @ApiOkResponse({ description: 'Аутентификация через Гугл прошла успено' })
    @Get('/google/redirect')
    @UseGuards(AuthGuard('google'))
    googleAuthRedirect(@Req() req) {
        return this.authService.googleLogin(req);
    }

    @ApiOperation({ summary: 'Аутентификация ВК' })
    @ApiOkResponse({ description: 'Аутентификация инициализирована' })
    @Get('/vk')
    @UseGuards(AuthGuard('vk'))
    async vkAuth(@Req() req) {}
  
    @ApiOperation({ summary: 'Перенаправление аутентификации ВК' })
    @ApiOkResponse({ description: 'Аутентификация через ВК прошла успено' })
    @Get('/vk/redirect')
    @UseGuards(AuthGuard('vk'))
    vkAuthRedirect(@Req() req) {
        return this.authService.vkLogin(req);
    }

    @ApiOperation({ summary: 'Регистрация пользователя' })
    @ApiOkResponse({ description: 'Пользователь успешно зарегистрирован' })
    @ApiBody({
        type: CreateUserDto,
            examples: {
                example1: {
                value: {
                    login: "admin",
                    email: "admin@mail.ru",
                    password: "admin",
                },
                summary: 'Пример создания пользователя',
                },
            },
    })
    @Post('/signup')
    async signUp(@Body() createUserDto: CreateUserDto) {
        const user = await this.authService.signUp(createUserDto);
        return user;
    }

    @ApiOperation({ summary: 'Вход пользователя' })
    @ApiOkResponse({ description: 'Пользователь успешно вошел' })
    @ApiBody({
        type: AuthDto,
            examples: {
                example1: {
                value: {
                    login: "admin",
                    email: "admin@mail.ru",
                    password: "admin",
                },
                summary: 'Пример входа пользователя',
                },
            },
    })
    @Post('/signin')
    async signIn(@Body() data: AuthDto) {
        const user = await this.authService.signIn(data);
        return user;
    }

    @ApiOperation({ summary: 'Выход пользователя' })
    @ApiBearerAuth()
    @ApiOkResponse({ description: 'Пользователь успешно вышел' })
    @UseGuards(AccessTokenGuard)
    @Get('/logout')
    logout(@Req() req: Request) {
        this.authService.logout(req.user['sub']);
    }

    @ApiOperation({ summary: 'Обновление токенов' })
    @ApiBearerAuth()
    @ApiOkResponse({
        description: 'Tokens successfully refreshed.',
        schema: {
            example: {
                accessToken: '...',
                refreshToken: '...',
            },
        },
    })
    @UseGuards(RefreshTokenGuard)
    @Get('/refresh')
    refreshTokens(@Req() req: Request) {
        const userId = req.user['sub'];
        const refreshToken = req.user['refreshToken'];
        return this.authService.refreshTokens(userId, refreshToken);
    }
}
