import { Module } from '@nestjs/common';
import { MovieController } from './movie.controller';
import { MovieService } from './movie.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { Movie, Country, Genre } from "@app/common";
import { CountryModule } from './country/country.module';
import { GenreModule } from './genre/genre.module';
import { MovieCountry } from './country/movie-country.model';
import { MovieGenre } from './genre/movie-genre.model';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),
        SequelizeModule.forFeature([Movie, Country, MovieCountry, Genre, MovieGenre]),
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
                models: [Movie, Country, MovieCountry, Genre, MovieGenre],
                
                autoLoadModels: true,
            }),
            inject: [ConfigService],
        }),
        CountryModule,
        GenreModule,
    ],
    controllers: [MovieController],
    providers: [MovieService],
})
export class MovieModule {}
