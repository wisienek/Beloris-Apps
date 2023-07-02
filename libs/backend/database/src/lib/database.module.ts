import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { migrationsRunner } from './migrations-runner';
import { getConfig } from './db-config';

const dbConfig = getConfig();

@Module({
  imports: [TypeOrmModule.forRoot(dbConfig)],
})
export class DataBaseModule implements OnModuleInit {
  private readonly logger = new Logger(DataBaseModule.name);

  async onModuleInit() {
    this.logger.debug(`Running migrations on ${(dbConfig as any).host}...`);

    await migrationsRunner();

    this.logger.debug(`Finished migrations!`);
  }
}
