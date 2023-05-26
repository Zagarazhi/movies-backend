import { IsNumber, IsOptional, IsString } from "class-validator";

// DTO-класс для обновления фильма
export class UpdateMovieDto {
    @IsNumber()
    readonly id: number;

    @IsString()
    @IsOptional()
    readonly nameRu?: string;

    @IsString()
    @IsOptional()
    readonly nameEn? : string;
}