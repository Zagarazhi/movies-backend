import { Module } from '@nestjs/common';
import { MovieController } from './movie.controller';
import { MovieService } from './movie.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { Movie, Country, Genre, MovieCountry, MovieGenre, Video, SimilarMovies } from "@app/common";
import { CountryModule } from './country/country.module';
import { VideoModule } from './video/video.module'
import { GenreModule } from './genre/genre.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),
        SequelizeModule.forFeature([Movie, Country, MovieCountry, Genre, MovieGenre, Video, SimilarMovies]),
        SequelizeModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                // Конфигурация БД
                dialect: 'postgres',
                host: configService.get("POSTGRES_MOVIES_HOST"),
                port: Number(configService.get("POSTGRES_MOVIES_PORT")),
                username: configService.get("POSTGRES_MOVIES_USER"),
                password: configService.get("POSTGRES_MOVIES_PASSWORD"),
                database: configService.get("POSTGRES_MOVIES_DB"),
                models: [Movie, Country, MovieCountry, Genre, MovieGenre, Video, SimilarMovies],
                
                autoLoadModels: true,
            }),
            inject: [ConfigService],
        }),
        CountryModule,
        GenreModule,
        VideoModule,
    ],
    controllers: [MovieController],
    providers: [MovieService],
})
export class MovieModule {}
