import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { getConfig } from './to-config';

@Module({
  imports: [TypeOrmModule.forRoot(getConfig())],
})
export class DataBaseModule {}
