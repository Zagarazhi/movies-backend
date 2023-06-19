import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

// DTO-класс для создания жанра
export class CreateGenreDto {
    @ApiProperty({ example: 'Фантастика', description: 'Название жанра' })
    @IsString({message: "Должно быть строкой"})
    readonly genre: string;
}