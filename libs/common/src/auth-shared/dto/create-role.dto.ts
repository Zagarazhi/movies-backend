import { IsString } from "class-validator";

// DTO-класс для создания ролей
export class CreateRoleDto {
    @IsString({message: "Должно быть строкой"})
    readonly value: string;
    @IsString({message: "Должно быть строкой"})
    readonly description: string;
}