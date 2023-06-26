import { Test, TestingModule } from '@nestjs/testing';
import { MovieController } from './movie.controller';
import { MovieService } from './movie.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { AccessTokenStrategy, Country, Genre, GoogleStrategy, Movie, MovieCountry, MovieGenre, RefreshTokenStrategy, SimilarMovies, UpdateMovieDto, VKStrategy, Video } from '@app/common';
import { CountryModule } from './country/country.module';
import { GenreModule } from './genre/genre.module';
import { VideoModule } from './video/video.module';

describe('MovieController', () => {
    let controller: MovieController;
    let movieService: MovieService;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
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
            providers: [MovieService, AccessTokenStrategy, RefreshTokenStrategy, GoogleStrategy, VKStrategy],
        }).compile();

        controller = moduleRef.get<MovieController>(MovieController);
        movieService = moduleRef.get<MovieService>(MovieService);
    });

    describe('updateMovie', () => {
        it('Должен обновить фильм', async () => {
            const updateMovieDto: UpdateMovieDto = {
                id: 1,
                nameRu: 'Матрица',
                nameEn: 'The Matrix',
            };
            const expectedResult = await Movie.findByPk(1);

            jest.spyOn(movieService, 'updateMovie').mockResolvedValue(expectedResult);

            const result = await controller.updateMovie(updateMovieDto);

            expect(movieService.updateMovie).toHaveBeenCalledWith(updateMovieDto);
            expect(result).toBe(expectedResult);
        });
    });
});
