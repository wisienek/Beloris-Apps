import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import configuration from '../config/configuration';
import { configurationSchema } from '../config';
import { AuthModule } from './auth';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema: configurationSchema,
    }),
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
