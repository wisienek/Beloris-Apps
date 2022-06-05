import { Module } from '@nestjs/common';
import { UploaderService } from './uploader.service';
import { AwsModule } from '@bella/aws';

@Module({
  imports: [AwsModule],
  providers: [UploaderService],
})
export class UpdaterModule {}
