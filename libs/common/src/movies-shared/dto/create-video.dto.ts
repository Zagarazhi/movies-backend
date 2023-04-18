import { IsString } from "class-validator";

// DTO-класс для создания видео
export class CreateVideoDto {
    @IsString()
    readonly name: string;
    @IsString()
    readonly url: string;
    @IsString()
    readonly site: string;
}