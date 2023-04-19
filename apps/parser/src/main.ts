import { NestFactory } from '@nestjs/core';
import { ParserModule } from './parser.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
    const app = await NestFactory.create(ParserModule);
    const configService = app.get(ConfigService);
    app.connectMicroservice<MicroserviceOptions>(
        {
            transport: Transport.TCP,
            options: {
                host: configService.get('PARSER_HOST'),
                port: configService.get('PARSER_PORT'),
            }
        }
    );
    app.enableCors({
        origin: "*",
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        preflightContinue: false,
        optionsSuccessStatus: 204
    });
    app.useGlobalPipes(new ValidationPipe());
    await app.startAllMicroservices();
    await app.listen(configService.get("PARSER_PORT"));
    
}
bootstrap();
