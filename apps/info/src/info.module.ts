import { Module } from '@nestjs/common';
import { InfoController } from './info.controller';
import { InfoService } from './info.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { Country, Genre, Movie, MovieCountry, MovieGenre, SimilarMovies, Video } from '@app/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

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
        ClientsModule.registerAsync([
            {
                name: 'MOVIE_SERVICE',
                useFactory: (configService: ConfigService) => ({
                    transport: Transport.TCP,
                    options: {
                        port: configService.get('MOVIES_PORT'),
                        host: configService.get('MOVIES_HOST'),
                    },
                }),
                inject: [ConfigService],
            },
            {
                name: 'COMMENT_SERVICE',
                useFactory: (configService: ConfigService) => ({
                    transport: Transport.TCP,
                    options: {
                        port: configService.get('COMMENT_PORT'),
                        host: configService.get('COMMENT_HOST'),
                    },
                }),
                inject: [ConfigService],
            },
            {
                name: 'PERSON_SERVICE',
                useFactory: (configService: ConfigService) => ({
                    transport: Transport.TCP,
                    options: {
                        port: configService.get('PERSON_PORT'),
                        host: configService.get('PERSON_HOST'),
                    },
                }),
                inject: [ConfigService],
            },
        ]),
    ],
    controllers: [InfoController],
    providers: [InfoService],
})
export class InfoModule {}
