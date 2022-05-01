import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { exportConfig } from './to-config';

@Module({
  imports: [
    TypeOrmModule.forRoot(exportConfig()),
  ]
})
export class DataBaseModule {}
