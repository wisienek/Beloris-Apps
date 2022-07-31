import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Post,
  Query,
  UploadedFile,
} from '@nestjs/common';
import {
  ApiConsumes,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import { FileUploaderService } from './file-uploader.service';
import { UploadedFileInterceptor } from './validators';
import { ApiFile } from './utils';

import {
  FileListDto,
  GetFileListDto,
  FileUploadDto,
  UploadPackageInfo,
  UploadedS3FileDto,
} from '@bella/shared';
import { MulterFile } from './typings';

@ApiTags('Uploader - files')
@Controller('uploader/:major/:minor/')
export class FileUploaderController {
  constructor(private fileUploaderService: FileUploaderService) {}

  @Get('file-list')
  @ApiOkResponse({
    description: 'List of files to download',
    type: FileListDto,
  })
  @ApiNotFoundResponse({
    description: 'Bad version',
  })
  async getModList(
    @Param('major', ParseIntPipe) major: number,
    @Param('minor', ParseIntPipe) minor: number,
    @Query() data: GetFileListDto,
  ): Promise<FileListDto> {
    return await this.fileUploaderService.getFileList(data, major, minor);
  }

  @Post('package')
  async createPackageData(
    @Param('major', ParseIntPipe) major: number,
    @Body() fileData: UploadPackageInfo,
  ) {
    return await this.fileUploaderService.createPackageData(major, fileData);
  }

  @Post('package/:uuid')
  @ApiParam({
    name: 'uuid',
    description: 'UUID of a created record',
  })
  @ApiOkResponse({
    type: UploadedS3FileDto,
    description: 'Uploaded file data',
  })
  @ApiConsumes('multipart/form-data')
  @ApiFile()
  @UploadedFileInterceptor(80_000_000, 1, [
    'application/gzip',
    'application/vnd.rar',
    'application/x-tar',
    'application/x-7z-compressed',
  ])
  async uploadPackageFile(
    @Param('major', ParseIntPipe) major: number,
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @UploadedFile() file: MulterFile,
  ) {
    return await this.fileUploaderService.handleUploadFile(
      major,
      1,
      file,
      uuid,
      true,
    );
  }

  @Post('file-list')
  async uploadFileData(
    @Param('major', ParseIntPipe) major: number,
    @Param('minor', ParseIntPipe) minor: number,
    @Body() fileData: FileUploadDto,
  ) {
    return this.fileUploaderService.uploadFile(major, minor, fileData);
  }

  @Post('file-list/:uuid')
  @ApiParam({
    name: 'uuid',
    description: 'UUID of a created record',
  })
  @ApiOkResponse({
    type: UploadedS3FileDto,
    description: 'Uploaded file data',
  })
  @ApiConsumes('multipart/form-data')
  @ApiFile()
  @UploadedFileInterceptor(15_000_000, 1, null, [
    'png',
    'cfg',
    'txt',
    'json',
    'toml',
    'dat',
    'ogg',
    'jar',
    'rar',
    'zip',
  ])
  async uploadFile(
    @Param('major', ParseIntPipe) major: number,
    @Param('minor', ParseIntPipe) minor: number,
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @UploadedFile() file: MulterFile,
  ) {
    return this.fileUploaderService.handleUploadFile(
      major,
      minor,
      file,
      uuid,
      false,
    );
  }
}
