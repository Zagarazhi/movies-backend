import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AuthModule);
    const configService = app.get(ConfigService);
    app.connectMicroservice<MicroserviceOptions>(
        {
            transport: Transport.TCP,
            options: {
                host: configService.get('AUTH_HOST'),
                port: configService.get('AUTH_PORT'),
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
    await app.listen(configService.get("AUTH_PORT"));
}
bootstrap();
