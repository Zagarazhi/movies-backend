import { IsNumber, IsString, ValidateNested } from "class-validator";
import { CreateRoleInfoDto } from "./create-role-info.dto";

// DTO-класс для создания человека
export class CreatePersonDto {

    @IsString()
    readonly nameRu: string;

    @IsString()
    readonly nameEn: string; 

    @IsString()
    readonly posterUrl: string;

    @IsNumber()
    readonly staffId: number;

    @ValidateNested()
    readonly role: CreateRoleInfoDto;
}