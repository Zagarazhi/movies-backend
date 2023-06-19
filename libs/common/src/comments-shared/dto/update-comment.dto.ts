import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

enum TypesEnum {
  POSITIVE = 'POSITIVE',
  NEUTRAL = 'NEUTRAL',
  NEGATIVE = 'NEGATIVE',
}

export class UpdateCommentDto {
  @ApiProperty({ enum: TypesEnum, example: 'POSITIVE', description: 'Обновленный тип комментария' })
  @IsOptional()
  @IsEnum(TypesEnum)
  readonly type: string;

  @ApiProperty({ example: 'Классный фильм', description: 'Обновленный заголовок комментария' })
  @IsOptional()
  @IsString()
  readonly title: string;

  @ApiProperty({ example: 'Очень понравился фильм', description: 'Обновленное содержание комментария' })
  @IsOptional()
  @IsString()
  readonly description: string;
}
