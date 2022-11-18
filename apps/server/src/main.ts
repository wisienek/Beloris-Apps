import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {
  ClassSerializerInterceptor,
  Logger,
  ValidationPipe,
} from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';

import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import * as passport from 'passport';

import { AppModule } from './app/app.module';
import { SocketIoAdapter } from './app/websocket';
import { getStaticConfig, ServerConfig } from '@bella/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const serverConfig = getStaticConfig(ServerConfig);

  app.setGlobalPrefix(serverConfig.globalPrefix);
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:4200',
      'http://127.0.0.1:4200',
    ],
    credentials: true,
  });
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      enableDebugMessages: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.use(
    session({
      cookie: {
        maxAge: 86400000,
      },
      secret: '##13-secrets-of-astras-and-felina@@',
      resave: false,
      saveUninitialized: false,
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useWebSocketAdapter(new SocketIoAdapter(app, ['*', 'null']));

  const docsConfig = new DocumentBuilder()
    .setTitle('BelorisRP Documentation')
    .addBearerAuth()
    .addBasicAuth()
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, docsConfig);
  SwaggerModule.setup(`${serverConfig.globalPrefix}/docs`, app, document);

  await app.listen(serverConfig.port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${serverConfig.port}/${serverConfig.globalPrefix}`,
    AppModule.name,
  );
}

bootstrap();
