import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { VersionService } from './version.service';
import { Body, Controller, Delete, Get, Patch, Post } from '@nestjs/common';
import { CreateVersionDto, DeleteVersionDto, VersionDto } from '@bella/dto';

@ApiTags('Uploader - Versions')
@Controller('uploader/version')
export class VersionController {
  constructor(private readonly versionService: VersionService) {}

  @Get()
  @ApiOkResponse({
    type: VersionDto,
    description: 'Returns current version info',
  })
  async getCurrentVersion() {
    return await this.versionService.getCurrentVersion();
  }

  @Post()
  @ApiOkResponse({
    type: VersionDto,
    isArray: true,
    description: 'Array of updated versions (2 if changed current version)',
  })
  async createNewVersion(@Body() data: CreateVersionDto) {
    return await this.versionService.createVersion(data);
  }

  @Patch()
  @ApiOkResponse({
    type: VersionDto,
    isArray: true,
    description: 'Array of updated versions (2 if changed current version)',
  })
  async updateVersion(@Body() data: CreateVersionDto) {
    return await this.versionService.updateCurrentVersion(data);
  }

  @Delete()
  @ApiOkResponse({
    type: VersionDto,
    description: 'Deleted version',
  })
  async removeVersion(@Body() data: DeleteVersionDto) {
    return await this.versionService.deleteVersion(data);
  }

  @Get('history')
  @ApiOkResponse({
    type: VersionDto,
    isArray: true,
    description: 'Returns version history info',
  })
  async getVersionHistory() {
    return await this.versionService.getVersionHistory();
  }
}
