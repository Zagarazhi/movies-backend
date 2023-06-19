import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { MovieModule } from './movie.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create(MovieModule);
    const configService = app.get(ConfigService);

    const options = new DocumentBuilder()
        .setTitle('Auth API')
        .setDescription('API документация для сервиса фильмов')
        .setVersion('1.0')
        .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api', app, document);

    app.connectMicroservice<MicroserviceOptions>(
        {
            transport: Transport.TCP,
            options: {
                host: configService.get('MOVIES_HOST'),
                port: configService.get('MOVIES_PORT'),
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
    app.startAllMicroservices();
    await app.listen(configService.get("MOVIES_PORT"));
}
bootstrap();
