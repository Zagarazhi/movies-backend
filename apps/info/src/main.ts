import { NestFactory } from '@nestjs/core';
import { InfoModule } from './info.module';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create(InfoModule);
    const configService = app.get(ConfigService);

    const options = new DocumentBuilder()
        .setTitle('Auth API')
        .setDescription('API документация для сервиса информации')
        .setVersion('1.0')
        .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api', app, document);

    app.connectMicroservice<MicroserviceOptions>(
        {
            transport: Transport.TCP,
            options: {
                host: configService.get('INFO_HOST'),
                port: configService.get('INFO_PORT'),
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
    await app.listen(configService.get("INFO_PORT"));
}
bootstrap();
