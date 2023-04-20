import { IsDateString, IsEnum, IsNumber, IsOptional, IsString } from "class-validator";

enum TypesEnum {
    'POSITIVE', 'NEUTRAL', 'NEGATIVE'
}

// DTO-класс для создания комментария
export class CreateCommentDto {
    @IsEnum(TypesEnum)
    readonly type: string;

    @IsDateString()
    readonly date: Date;
    
    @IsString()
    readonly author: string;
    
    @IsString()
    readonly title: string;
    
    @IsString()
    readonly description: string;
    
    @IsNumber()
    readonly movieId: number;
}