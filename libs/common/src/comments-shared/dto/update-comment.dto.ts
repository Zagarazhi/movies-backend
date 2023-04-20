import { IsEnum, IsOptional, IsString } from "class-validator";

enum TypesEnum {
    'POSITIVE', 'NEUTRAL', 'NEGATIVE'
}

// DTO-класс для обновления комментария
export class UpdateCommentDto {
    @IsOptional()
    @IsEnum(TypesEnum)
    readonly type: string;
    
    @IsOptional()
    @IsString()
    readonly title: string;
    
    @IsOptional()
    @IsString()
    readonly description: string;
}