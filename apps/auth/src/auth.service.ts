import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { UserService } from './users/user.service';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { ConfigService } from '@nestjs/config';
import { AuthDto, CreateUserDto } from '@app/common';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) {}

    async googleLogin(req: any) {
        if(!req.user) {
            throw new NotFoundException('В гугл не найдено такого пользователя');
        }
        const userExists = await this.userService.findByUsername(req.user.login);
        if(!userExists) {
            const user = await this.userService.externalCreate(req.user.login, req.user.email);
            const roles = user.roles.map(role => role.value);
            const tokens = await this.getTokens(user.id, user.login, roles);
            await this.updateRefreshToken(user.id, tokens.refreshToken);
            return tokens;
        }
        const roles = userExists.roles.map(role => role.value);
        const tokens = await this.getTokens(userExists.id, userExists.login, roles);
        await this.updateRefreshToken(userExists.id, tokens.refreshToken);
        return tokens;
    }

    async vkLogin(req: any) {
        if(!req.user) {
            throw new NotFoundException('В вк не найдено такого пользователя');
        }
        const userExists = await this.userService.findByUsername(req.user.login);
        if(!userExists) {
            const user = await this.userService.externalCreate(req.user.login, req.user.email);
            const roles = user.roles.map(role => role.value);
            const tokens = await this.getTokens(user.id, user.login, roles);
            await this.updateRefreshToken(user.id, tokens.refreshToken);
            return tokens;
        }
        const roles = userExists.roles.map(role => role.value);
        const tokens = await this.getTokens(userExists.id, userExists.login, roles);
        await this.updateRefreshToken(userExists.id, tokens.refreshToken);
        return tokens;
    }

    async signUp(createUserDto: CreateUserDto) {
        const userExist = await this.userService.findByUsername(
            createUserDto.login,
        );
        if(userExist) {
            throw new BadRequestException('Пользователь уже существует');
        }

        const hash = await this.hashData(createUserDto.password);
        const newUser = await this.userService.create({
            ...createUserDto,
            password: hash,
        });
        const roles = newUser.roles.map(role => role.value);
        const tokens = await this.getTokens(newUser.id, newUser.login, roles);
        await this.updateRefreshToken(newUser.id, tokens.refreshToken);
        return tokens;
    }

    async signIn(data: AuthDto) {
        const user = await this.userService.findByUsername(data.login);
        if(!user) throw new BadRequestException('Пользователь не найден');
        const passwordMatches = await argon2.verify(user.password, data.password);
        if(!passwordMatches) throw new BadRequestException('Неверный пароль');
        const roles = user.roles.map(role => role.value);
        const tokens = await this.getTokens(user.id, user.login, roles);
        await this.updateRefreshToken(user.id, tokens.refreshToken);
        return tokens;
    }

    async refreshTokens(userId: number, refreshToken: string) {
        const user = await this.userService.findById(userId);
        if(!user || !user.refreshToken) throw new ForbiddenException('Доступ запрещен');
        const refreshTokenMatches = await argon2.verify(user.refreshToken, refreshToken);
        if(!refreshTokenMatches) throw new ForbiddenException('Доступ запрещен');
        const roles = user.roles.map(role => role.value);
        const tokens = await this.getTokens(user.id, user.login, roles);
        await this.updateRefreshToken(user.id, tokens.refreshToken);
        return tokens;
    }

    async logout(userId: number) {
        return this.userService.update(userId, { refreshToken: null });
    }

    hashData(data: string) {
        return argon2.hash(data);
    }

    async updateRefreshToken(userId: number, refreshToken: string) {
        const hashedRefreshToken = await this.hashData(refreshToken);
        await this.userService.update(userId, {refreshToken: hashedRefreshToken});
    }

    async getTokens(userId: number, login: string, roles: string[]) {
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync({
                    sub: userId,
                    login,
                    roles,
                },
                {
                    secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
                    expiresIn: this.configService.get<string>('ACCESS_TOKEN_EXPIRES_IN'),
                },
            ),
            this.jwtService.signAsync(
                {
                    sub: userId,
                    login,
                    roles,
                },
                {
                    secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
                    expiresIn: this.configService.get<string>('REFRESH_TOKEN_EXPIRES_IN'),
                },
            ),
        ]);

        return {
            accessToken, refreshToken,
        };
    }
}
