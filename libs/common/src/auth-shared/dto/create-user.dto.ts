import { IsEmail, IsOptional, IsString } from "class-validator";

export class CreateUserDto {
    @IsEmail()
    readonly email: string;

    @IsString()
    readonly login: string;

    @IsString()
    readonly password: string;
}