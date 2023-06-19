import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

enum TypesEnum {
  POSITIVE = 'POSITIVE',
  NEUTRAL = 'NEUTRAL',
  NEGATIVE = 'NEGATIVE',
}

export class WriteCommentDto {
    @ApiProperty({ enum: TypesEnum, example: 'POSITIVE', description: 'Тип комментария' })
    @IsEnum(TypesEnum)
    readonly type: string;

    @ApiProperty({ example: 'Классный фильм', description: 'Заголовок комментария' })
    @IsString()
    readonly title: string;

    @ApiProperty({ example: 'Очень понравился фильм', description: 'Содержания комментария' })
    @IsString()
    readonly description: string;

    @ApiProperty({ example: 1, description: 'ID комментария, на который отвечает данный комментарий (опционально)' })
    @IsOptional()
    @IsNumber()
    readonly repliedOnComment?: number;
}
