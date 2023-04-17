import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { MovieModule } from './movie.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(MovieModule);
    app.connectMicroservice<MicroserviceOptions>(
        {
            transport: Transport.TCP,
        }
    );
    app.useGlobalPipes(new ValidationPipe());
    const configService = app.get(ConfigService);
    await app.listen(configService.get("MOVIES_PORT"));
}
bootstrap();
