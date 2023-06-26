import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from './users/user.module';
import { RoleModule } from './roles/role.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { AccessTokenStrategy, AuthDto, CreateUserDto, GoogleStrategy, RefreshTokenStrategy, Role, User, UserRoles, VKStrategy } from '@app/common';

describe('YourController', () => {
    let controller: AuthController;
    let authService: AuthService;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [
                UserModule,
                RoleModule,
                JwtModule.register({}),
                ConfigModule.forRoot({
                    isGlobal: true,
                    envFilePath: '.env',
                }),
                SequelizeModule.forFeature([User, Role, UserRoles]),
                SequelizeModule.forRootAsync({
                    imports: [ConfigModule],
                    useFactory: (configService: ConfigService) => ({
                        // Конфигурация БД
                        dialect: 'postgres',
                        host: configService.get("POSTGRES_USERS_HOST"),
                        port: Number(configService.get("POSTGRES_USERS_PORT")),
                        username: configService.get("POSTGRES_USERS_USER"),
                        password: configService.get("POSTGRES_USERS_PASSWORD"),
                        database: configService.get("POSTGRES_USERS_DB"),
                        models: [User, Role, UserRoles],
                        
                        autoLoadModels: true,
                    }),
                    inject: [ConfigService],
                }),
            ],
            controllers: [AuthController],
            providers: [AuthService, AccessTokenStrategy, RefreshTokenStrategy, GoogleStrategy, VKStrategy],
        }).compile();

            controller = moduleRef.get<AuthController>(AuthController);
            authService = moduleRef.get<AuthService>(AuthService);
        });

        describe('signUp', () => {
            it('Должен регистрировать пользователя', async () => {
                const createUserDto: CreateUserDto = {
                    login: 'temp',
                    email: 'temp@mail.ru',
                    password: 'temp',
                };
                const expectedResult = User.build(createUserDto);

                const accessToken = 'mockAccessToken';
                const refreshToken = 'mockRefreshToken';
                const user = { 
                    login: 'temp',
                    email: 'temp@mail.ru',
                    roles: [await Role.findByPk(1)],
                 };

                jest.spyOn(authService, 'signUp').mockResolvedValue({ accessToken, refreshToken, user });

                const result = await controller.signUp(createUserDto);

                expect(authService.signUp).toHaveBeenCalledWith(createUserDto);
                expect(result.user).toBe(user);
            });
        });

        describe('signIn', () => {
            it('Должен выполнять вход', async () => {
                const authDto: AuthDto = {
                    login: 'admin',
                    email: 'admin@mail.ru',
                    password: 'admin',
                };
                const accessToken = 'mockAccessToken';
                const refreshToken = 'mockRefreshToken';
                const user = { 
                    login: 'admin',
                    email: 'admin@mail.ru',
                    roles: [await Role.findByPk(1), await Role.findByPk(2)],
                };

                jest.spyOn(authService, 'signIn').mockResolvedValue({ accessToken, refreshToken, user });

                const result = await controller.signIn(authDto);

                expect(authService.signIn).toHaveBeenCalledWith(authDto);
                expect(result.user).toBe(user);
            });
    });
});
