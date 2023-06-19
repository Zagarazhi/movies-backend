import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString } from "class-validator";

// DTO-класс для обновления фильма
export class UpdateMovieDto {

    @ApiProperty({ example: 1, description: 'ID фильма' })
    @IsNumber()
    readonly id: number;

    @ApiProperty({ example: 'Матрица', description: 'Обновленное название фильма на русском' })
    @IsString()
    @IsOptional()
    readonly nameRu?: string;

    @ApiProperty({ example: 'The Matrix', description: 'Обновленное название фильма на английском' })
    @IsString()
    @IsOptional()
    readonly nameEn? : string;
}