import { IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateVideoDto {
    @ApiProperty({ example: 'Название видео', description: 'Название видео' })
    @IsString()
    readonly name: string;

    @ApiProperty({ example: 'https://example.com/video', description: 'Ссылка на видео' })
    @IsString()
    readonly url: string;

    @ApiProperty({ example: 'YouTube', description: 'Сайт хостинга видео' })
    @IsString()
    readonly site: string;
}