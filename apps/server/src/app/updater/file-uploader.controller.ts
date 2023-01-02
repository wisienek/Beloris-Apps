import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Patch,
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
import { AllowedFileSizes, AllowedUploaderFileExtensions } from '@bella/data';
import { DCTestServerRoles, FileType } from '@bella/enums';
import {
  FileListDto,
  GetFileListDto,
  FileUploadDto,
  UploadPackageInfo,
  UploadedS3FileDto,
  UpdatePackageFileInfo,
} from '@bella/dto';
import { FileUploaderService } from './file-uploader.service';
import { UploadedFileInterceptor } from './validators';
import { MulterFile } from './typings';
import { ApiFile } from './utils';
import { Auth } from '../auth';

@ApiTags('Uploader - files')
@Controller('uploader/:major/:minor/')
export class FileUploaderController {
  constructor(private fileUploaderService: FileUploaderService) {}

  @Get('update-files')
  @ApiOkResponse({
    description: 'List of changes from last version',
  })
  async getUpdateFiles(
    @Param('major', ParseIntPipe) major: number,
    @Param('minor', ParseIntPipe) minor: number,
  ) {
    return await this.fileUploaderService.getFilesToUpdate(major, minor);
  }

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

  @Auth(DCTestServerRoles.MOD_MASTER)
  @Post('package')
  async createPackageData(
    @Param('major', ParseIntPipe) major: number,
    @Body() fileData: UploadPackageInfo,
  ) {
    return await this.fileUploaderService.createPackageData(major, fileData);
  }

  @Auth(DCTestServerRoles.MOD_MASTER)
  @Patch('package/:uuid')
  updatePackageData(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() fileData: UpdatePackageFileInfo,
  ) {
    return this.fileUploaderService.updateFileData(uuid, fileData);
  }

  @Auth(DCTestServerRoles.MOD_MASTER)
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
  @UploadedFileInterceptor(AllowedFileSizes[FileType.BUNDLE], 1, [
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

  @Auth(DCTestServerRoles.MOD_MASTER)
  @Post('file-list')
  async uploadFileData(
    @Param('major', ParseIntPipe) major: number,
    @Param('minor', ParseIntPipe) minor: number,
    @Body() fileData: FileUploadDto,
  ) {
    return this.fileUploaderService.uploadFileData(major, minor, fileData);
  }

  @Auth(DCTestServerRoles.MOD_MASTER)
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
  @UploadedFileInterceptor(15_000_000, 1, null, AllowedUploaderFileExtensions)
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
