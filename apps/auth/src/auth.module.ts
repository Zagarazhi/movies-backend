import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from './users/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { AccessTokenStrategy, GoogleStrategy, RefreshTokenStrategy, Role, User, UserRoles, VKStrategy } from '@app/common';
import { RoleModule } from './roles/role.module';
import { SwaggerModule } from '@nestjs/swagger';

@Module({
    imports: [
        UserModule,
        RoleModule,
        SwaggerModule,
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
})
export class AuthModule {}
