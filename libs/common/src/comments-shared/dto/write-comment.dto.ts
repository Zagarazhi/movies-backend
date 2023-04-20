import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";

enum TypesEnum {
    'POSITIVE', 'NEUTRAL', 'NEGATIVE'
}

// DTO-класс для создания комментария
export class WriteCommentDto {
    @IsEnum(TypesEnum)
    readonly type: string;
    
    @IsString()
    readonly title: string;
    
    @IsString()
    readonly description: string;

    @IsOptional()
    @IsNumber()
    readonly repliedOnComment?: number;
}