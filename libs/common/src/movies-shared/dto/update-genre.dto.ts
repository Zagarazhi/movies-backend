import { IsNumber, IsOptional, IsString } from "class-validator";

// DTO-класс для обновления жанра
export class UpdateGenreDto {
    @IsNumber()
    readonly id: number;

    @IsString()
    @IsOptional()
    readonly nameRu?: string;

    @IsString()
    @IsOptional()
    readonly nameEn? : string;
}