import { IsNumber, IsOptional, IsString } from "class-validator";

// DTO-класс для создания роли
export class CreateRoleInfoDto {

    @IsString()
    readonly nameRu: string;

    @IsString()
    readonly nameEn: string; 

    @IsString()
    @IsOptional()
    readonly description: string;;

    @IsNumber()
    readonly movieId: number;
}