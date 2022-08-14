import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { VersionService } from './version.service';
import { Body, Controller, Delete, Get, Patch, Post } from '@nestjs/common';
import { CreateVersionDto, DeleteVersionDto } from '@bella/dto';

@ApiTags('Uploader - Versions')
@Controller('uploader/version')
export class VersionController {
  constructor(private readonly versionService: VersionService) {}

  @Get()
  @ApiOkResponse({
    description: 'Returns current version info',
  })
  async getCurrentVersion() {
    return await this.versionService.getCurrentVersion();
  }

  @Post()
  async createNewVersion(@Body() data: CreateVersionDto) {
    return await this.versionService.createVersion(data);
  }

  @Patch()
  async updateVersion(@Body() data: CreateVersionDto) {
    return await this.versionService.updateCurrentVersion(data);
  }

  @Delete()
  async removeVersion(@Body() data: DeleteVersionDto) {
    return await this.versionService.deleteVersion(data);
  }

  @Get('history')
  @ApiOkResponse({
    description: 'Returns version history info',
  })
  async getVersionHistory() {
    return await this.versionService.getVersionHistory();
  }
}
