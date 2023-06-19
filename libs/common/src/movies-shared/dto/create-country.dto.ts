import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

// DTO-класс для создания страны
export class CreateCountryDto {
    @ApiProperty({ example: 'США', description: 'Название страны' })
    @IsString({message: "Должно быть строкой"})
    readonly country: string;
}