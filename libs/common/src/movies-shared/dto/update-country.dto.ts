import { IsNumber, IsOptional, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateCountryDto {
    @ApiProperty({ example: 1, description: 'ID страны' })
    @IsNumber()
    readonly id: number;

    @ApiProperty({ example: 'США', description: 'Обновленное название страны на русском' })
    @IsString()
    @IsOptional()
    readonly nameRu?: string;

    @ApiProperty({ example: 'USA', description: 'Обновленное название страны на английском' })
    @IsString()
    @IsOptional()
    readonly nameEn?: string;
}
