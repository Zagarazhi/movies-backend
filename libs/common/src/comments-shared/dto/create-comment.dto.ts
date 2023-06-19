import { IsDateString, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

enum TypesEnum {
  POSITIVE = 'POSITIVE',
  NEUTRAL = 'NEUTRAL',
  NEGATIVE = 'NEGATIVE',
}

export class CreateCommentDto {
    @ApiProperty({ enum: TypesEnum, example: 'POSITIVE', description: 'Тип комментария' })
    @IsEnum(TypesEnum)
    readonly type: string;

    @ApiProperty({ example: '2023-06-05T12:00:00Z', description: 'Дата написания комментария' })
    @IsDateString()
    readonly date: Date;

    @ApiProperty({ example: 'John.doe', description: 'Автор комментария' })
    @IsString()
    readonly author: string;

    @ApiProperty({ example: 'Классный фильм', description: 'Заголовок комментария' })
    @IsString()
    readonly title: string;

    @ApiProperty({ example: 'Фильм очень понравился', description: 'Содержание комментария' })
    @IsString()
    readonly description: string;

    @ApiProperty({ example: 123, description: 'ID фильма, с которым связан коммеентарий' })
    @IsNumber()
    readonly movieId: number;
}
