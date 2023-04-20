import { NestFactory } from "@nestjs/core";
import { DocumentBuilder } from "@nestjs/swagger";
import { SwaggerModule } from "@nestjs/swagger/dist";
import { AppModule } from "./app.module";
import { JwtAuthGuard } from "./auth/jwt-auth.guard";


async function start() {
  const PORT = process.env.PORT || 5000;
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('BACKEND')
    .setDescription('REST API')
    .setVersion('1.0.0')
    .addTag('TAG')
    .build()

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/docs', app, document); 
  //app.useGlobalGuards(JwtAuthGuard) - ограничение доступа ко всем endpoint

  await app.listen(PORT, () => console.log(`Server st. on port = ${PORT}`));
  
}

start();
