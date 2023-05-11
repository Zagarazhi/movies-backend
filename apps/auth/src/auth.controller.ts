import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request } from 'express';
import { AccessTokenGuard, AuthDto, CreateUserDto, RefreshTokenGuard } from '@app/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('/auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Get('/google')
    @UseGuards(AuthGuard('google'))
    async googleAuth(@Req() req) {}
  
    @Get('/google/redirect')
    @UseGuards(AuthGuard('google'))
    googleAuthRedirect(@Req() req) {
        return this.authService.googleLogin(req);
    }

    @Get('/vk')
    @UseGuards(AuthGuard('vk'))
    async vkAuth(@Req() req) {}
  
    @Get('/vk/redirect')
    @UseGuards(AuthGuard('vk'))
    vkAuthRedirect(@Req() req) {
        return this.authService.vkLogin(req);
    }

    @Post('/signup')
    async signUp(@Body() createUserDto: CreateUserDto) {
        const user = await this.authService.signUp(createUserDto);
        return user;
    }

    @Post('/signin')
    async signIn(@Body() data: AuthDto) {
        const user = await this.authService.signIn(data);
        return user;
    }

    @UseGuards(AccessTokenGuard)
    @Get('/logout')
    logout(@Req() req: Request) {
        this.authService.logout(req.user['sub']);
    }

    @UseGuards(RefreshTokenGuard)
    @Get('/refresh')
    refreshTokens(@Req() req: Request) {
        const userId = req.user['sub'];
        const refreshToken = req.user['refreshToken'];
        return this.authService.refreshTokens(userId, refreshToken);
    }
}
