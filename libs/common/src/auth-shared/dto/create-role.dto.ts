import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleDto {
    @ApiProperty({ example: 'АДМИН', description: 'Имя роли' })
    @IsString({ message: 'Должно быть строкой' })
    readonly value: string;

    @ApiProperty({ example: 'Великий и ужасный', description: 'Описание роли' })
    @IsString({ message: 'Должно быть строкой' })
    readonly description: string;
}