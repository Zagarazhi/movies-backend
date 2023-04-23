import { Module } from '@nestjs/common';
import { PersonController } from './person.controller';
import { PersonService } from './person.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { Person, RoleInfo } from '@app/common';

@Module({
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
    providers: [PersonService],
})
export class PersonModule {}
