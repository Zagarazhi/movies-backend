import { IsString } from "class-validator";

// DTO-класс для создания жанра
export class CreateGenreDto {
    @IsString({message: "Должно быть строкой"})
    readonly genre: string;
}