import { Test } from '@nestjs/testing';
import { PersonService } from './person.service';
import { PersonController } from './person.controller';
import { AccessTokenStrategy, GoogleStrategy, Person, RefreshTokenStrategy, RoleInfo, VKStrategy } from '@app/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';

describe('PersonController', () => {
    let controller: PersonController;
    let personService: PersonService;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({
                    isGlobal: true,
                    envFilePath: '.env',
                }),
                SequelizeModule.forFeature([Person, RoleInfo]),
                SequelizeModule.forRootAsync({
                    imports: [ConfigModule],
                    useFactory: (configService: ConfigService) => ({
                        // Конфигурация БД
                        dialect: 'postgres',
                        host: configService.get("POSTGRES_PERSONS_HOST"),
                        port: Number(configService.get("POSTGRES_PERSONS_PORT")),
                        username: configService.get("POSTGRES_PERSONS_USER"),
                        password: configService.get("POSTGRES_PERSONS_PASSWORD"),
                        database: configService.get("POSTGRES_PERSONS_DB"),
                        models: [Person, RoleInfo],
                        
                        autoLoadModels: true,
                    }),
                    inject: [ConfigService],
                }),
            ],
            controllers: [PersonController],
            providers: [PersonService, AccessTokenStrategy, RefreshTokenStrategy, GoogleStrategy, VKStrategy],
        }).compile();

        controller = moduleRef.get<PersonController>(PersonController);
        personService = moduleRef.get<PersonService>(PersonService);
    });

    describe('getAllActors', () => {
        it('Должен вернуть актеров без ключевых слов', async () => {
            const offset = 0;
            const limit = 10;
            const expectedResult: Person[] = await Person.findAll({
                offset, 
                limit,
                include: [
                    {
                        model: RoleInfo,
                        where: {nameEn: 'Actors'},
                        attributes: [],
                    }
                ]
            });

            jest.spyOn(personService, 'getAllActors').mockResolvedValue(expectedResult);

            const result = await controller.getAllActors(undefined, offset + 1, limit);

            expect(personService.getAllActors).toHaveBeenCalledWith(offset + 1, limit);
            expect(result).toBe(expectedResult);
        });

        it('Должен вернуть Киану', async () => {
            const keywords = 'Keanu';
            const page = 1;
            const limit = 10;
            const expectedResult: Person[] = [await Person.findByPk(3)];

            jest.spyOn(personService, 'getAllActorsByKeywords').mockResolvedValue(expectedResult);

            const result = await controller.getAllActors(keywords, page, limit);

            expect(personService.getAllActorsByKeywords).toHaveBeenCalledWith(page, limit, keywords);
            expect(result).toBe(expectedResult);
        });
    });
});
