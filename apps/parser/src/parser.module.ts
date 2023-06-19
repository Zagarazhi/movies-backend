import { Module } from '@nestjs/common';
import { ParserController } from './parser.controller';
import { ParserService } from './parser.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AccessTokenStrategy, GoogleStrategy, RefreshTokenStrategy, VKStrategy } from '@app/common';
import { SwaggerModule } from '@nestjs/swagger';

@Module({
    imports: [
        SwaggerModule,
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
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
    controllers: [ParserController],
    providers: [ParserService, AccessTokenStrategy, RefreshTokenStrategy, GoogleStrategy, VKStrategy],
    exports: [ClientsModule],
})
export class ParserModule {}
