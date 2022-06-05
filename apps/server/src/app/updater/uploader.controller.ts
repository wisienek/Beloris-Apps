import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { UploaderService } from './uploader.service';
import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { FileListDto, GetFileListDto } from '@bella/shared';

@ApiTags('Uploader')
@Controller('uploader')
export class UploaderController {
  constructor(private readonly uploaderService: UploaderService) {}

  /**
   * Might als do here Post for creating new versions,
   * Patch for updating version.
   *
   * Each has to have multipart upload
   */
  @Get('version')
  @ApiOkResponse({
    description: 'Returns current version info',
  })
  async getVersion() {
    return await this.uploaderService.getCurrentVersion();
  }

  @Get('version/:major/:minor/mod-list')
  @ApiParam({
    name: 'major',
    type: 'number',
    required: true,
  })
  @ApiParam({
    name: 'minor',
    type: 'number',
    required: true,
  })
  @ApiOkResponse({
    description: 'List of files to download',
  })
  @ApiNotFoundResponse({
    description: 'Bad version',
  })
  async getModList(
    @Param('major', ParseIntPipe) major: number,
    @Param('minor', ParseIntPipe) minor: number,
    @Query() data: GetFileListDto
  ): Promise<FileListDto> {
    return await this.uploaderService.getFileList(data, major, minor);
  }

  // @Post('upload')
  // async uploadMod() {
  //   return true;
  // }
}
