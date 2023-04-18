import { Module } from '@nestjs/common';
import { ParserController } from './parser.controller';
import { ParserService } from './parser.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
    imports: [
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
        ]),
    ],
    controllers: [ParserController],
    providers: [ParserService],
    exports: [ClientsModule],
})
export class ParserModule {}
