import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestFactory, Reflector } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import * as passport from 'passport';
import { ClassSerializerInterceptor, Logger, ValidationPipe } from '@nestjs/common';
import { getStaticConfig, ServerConfig } from '@bella/config';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const serverConfig = getStaticConfig(ServerConfig);
  const docsPath = `${serverConfig.globalPrefix}/docs`;

  app.setGlobalPrefix(serverConfig.globalPrefix);
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:4200', 'http://127.0.0.1:4200'],
    credentials: true,
  });
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      enableDebugMessages: true,
      forbidNonWhitelisted: true,
    })
  );
  app.use(
    session({
      cookie: {
        maxAge: 86400000,
      },
      secret: serverConfig.cookieSecret,
      resave: false,
      saveUninitialized: false,
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  const docsConfig = new DocumentBuilder()
    .setTitle('BelorisRP Documentation')
    .addBearerAuth()
    .addBasicAuth()
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, docsConfig);
  SwaggerModule.setup(docsPath, app, document);

  await app.listen(serverConfig.port);
  Logger.log(
    `Application is running on: http://localhost:${serverConfig.port}/${serverConfig.globalPrefix}`,
    AppModule.name
  );
}

bootstrap();
