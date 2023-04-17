import { IsString } from "class-validator";

// DTO-класс для создания страны
export class CreateCountryDto {
    @IsString({message: "Должно быть строкой"})
    readonly country: string;
}