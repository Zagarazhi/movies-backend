import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString } from "class-validator";

// DTO-класс для обновления жанра
export class UpdateGenreDto {
    @ApiProperty({ example: 1, description: 'ID жанра' })
    @IsNumber()
    readonly id: number;

    @ApiProperty({ example: 'Фантастика', description: 'Обновленное название жанра на русском' })
    @IsString()
    @IsOptional()
    readonly nameRu?: string;

    @ApiProperty({ example: 'Fantastic', description: 'Обновленное название жанра на английском' })
    @IsString()
    @IsOptional()
    readonly nameEn? : string;
}