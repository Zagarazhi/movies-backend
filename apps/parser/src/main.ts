import { NestFactory } from '@nestjs/core';
import { ParserModule } from './parser.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
    const app = await NestFactory.create(ParserModule);
    app.connectMicroservice<MicroserviceOptions>(
        {
            transport: Transport.TCP,
        }
    );
    app.useGlobalPipes(new ValidationPipe());
    const configService = app.get(ConfigService);
    await app.startAllMicroservices();
    await app.listen(configService.get("PARSER_PORT"));
    
}
bootstrap();
