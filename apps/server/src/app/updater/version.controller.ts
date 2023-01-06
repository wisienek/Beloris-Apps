import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { DCAdminServerRoles } from '@bella/enums';
import {
  CreateVersionDto,
  DeleteVersionDto,
  UpdateVersionDto,
  VersionDto,
} from '@bella/dto';
import { VersionService } from './version.service';
import { Auth } from '../auth';

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

  @Auth(DCAdminServerRoles.MOD_MEISTER)
  @Post()
  @ApiOkResponse({
    type: VersionDto,
    isArray: true,
    description: 'Array of updated versions (2 if changed current version)',
  })
  async createNewVersion(@Body() data: CreateVersionDto) {
    return await this.versionService.createVersion(data);
  }

  @Auth(DCAdminServerRoles.MOD_MEISTER)
  @Patch(':major/:minor')
  @ApiOkResponse({
    type: VersionDto,
    isArray: true,
    description: 'Array of updated versions (2 if changed current version)',
  })
  async updateVersion(
    @Param('major', ParseIntPipe) major: number,
    @Param('minor', ParseIntPipe) minor: number,
    @Body() data: UpdateVersionDto,
  ) {
    return await this.versionService.updateCurrentVersion(major, minor, data);
  }

  @Auth(DCAdminServerRoles.MOD_MEISTER)
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

  @Get(':major/:minor')
  async getVersion(
    @Param('major', ParseIntPipe) major: number,
    @Param('minor', ParseIntPipe) minor: number,
  ) {
    return await this.versionService.getSpecificVersion(major, minor);
  }
}
