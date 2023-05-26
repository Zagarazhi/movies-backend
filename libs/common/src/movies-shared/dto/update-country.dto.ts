import { IsNumber, IsOptional, IsString } from "class-validator";

// DTO-класс для обновления страны
export class UpdateCountryDto {
    @IsNumber()
    readonly id: number;

    @IsString()
    @IsOptional()
    readonly nameRu?: string;

    @IsString()
    @IsOptional()
    readonly nameEn? : string;
}