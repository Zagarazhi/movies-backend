import { IsEmail, IsString } from "class-validator";

export class AuthDto {

    @IsEmail()
    readonly email: string;

    @IsString()
    readonly login: string;

    @IsString()
    readonly password: string;
}