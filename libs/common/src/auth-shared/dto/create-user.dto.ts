import { IsEmail, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
    @ApiProperty({ example: 'user@example.com', description: 'Почта пользователя' })
    @IsEmail()
    readonly email: string;

    @ApiProperty({ example: 'john.doe', description: 'Логин пользователя' })
    @IsString()
    readonly login: string;

    @ApiProperty({ example: 'password123', description: 'Пароль пользователя' })
    @IsString()
    readonly password: string;
}