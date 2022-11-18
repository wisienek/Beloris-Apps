import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { getConfig } from './db-config';

@Module({
  imports: [TypeOrmModule.forRoot(getConfig())],
})
export class DataBaseModule {}
