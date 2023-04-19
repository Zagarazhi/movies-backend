import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { MovieModule } from './movie.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(MovieModule);
    const configService = app.get(ConfigService);
    app.connectMicroservice<MicroserviceOptions>(
        {
            transport: Transport.TCP,
            options: {
                host: configService.get('MOVIES_HOST'),
                port: configService.get('MOVIES_PORT'),
            }
        }
    );
    app.enableCors();
    app.useGlobalPipes(new ValidationPipe());
    app.startAllMicroservices();
    await app.listen(configService.get("MOVIES_PORT"));
}
bootstrap();
