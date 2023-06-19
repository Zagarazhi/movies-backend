import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthDto {
    @ApiProperty({ example: 'test@example.com', description: 'Почта пользователя' })
    @IsEmail()
    readonly email: string;

    @ApiProperty({ example: 'john.doe', description: 'Логин пользователя' })
    @IsString()
    readonly login: string;

    @ApiProperty({ example: 'password123', description: 'Пароль пользователя' })
    @IsString()
    readonly password: string;
}