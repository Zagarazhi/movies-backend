import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { Genre } from "@app/common";
import { GenreController } from "./genre.controller";
import { GenreService } from "./genre.service";
import { Movie } from "@app/common";
import { MovieGenre } from "@app/common";

@Module({
    imports: [
        SequelizeModule.forFeature([Genre, Movie, MovieGenre]),
    ],
    controllers: [GenreController],
    providers: [GenreService],
    exports: [GenreService],
})
export class GenreModule {}