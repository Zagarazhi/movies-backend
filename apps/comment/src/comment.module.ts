import { Module } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { AccessTokenStrategy, Comment, GoogleStrategy, RefreshTokenStrategy, VKStrategy } from '@app/common';
import { SwaggerModule } from '@nestjs/swagger';

@Module({
    imports: [
        SwaggerModule,
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),
        SequelizeModule.forFeature([Comment]),
        SequelizeModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                // Конфигурация БД
                dialect: 'postgres',
                host: configService.get("POSTGRES_COMMENTS_HOST"),
                port: Number(configService.get("POSTGRES_COMMENTS_PORT")),
                username: configService.get("POSTGRES_COMMENTS_USER"),
                password: configService.get("POSTGRES_COMMENTS_PASSWORD"),
                database: configService.get("POSTGRES_COMMENTS_DB"),
                models: [Comment],
                
                autoLoadModels: true,
            }),
            inject: [ConfigService],
        }),
    ],
    controllers: [CommentController],
    providers: [CommentService, AccessTokenStrategy, RefreshTokenStrategy, GoogleStrategy, VKStrategy],
})
export class CommentModule {}
