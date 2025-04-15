import {
    Controller,
    FileTypeValidator,
    MaxFileSizeValidator,
    ParseFilePipe,
    Post,
    UploadedFile,
    UseInterceptors,
  } from '@nestjs/common';
  import { UploadFileService } from './upload-file.service';
import { FileInterceptor } from '@nestjs/platform-express';
  
  @Controller('image')
  export class UploadFileController {
    constructor(private readonly cloudinaryService: UploadFileService) {}
  
    @Post('/upload')
    @UseInterceptors(FileInterceptor('file'))
    uploadImage(@UploadedFile(
        new ParseFilePipe({
          validators: [
            new MaxFileSizeValidator({ maxSize: 1 , message : "File is too large must be less than 1MB" }),
            new FileTypeValidator({ fileType: /^(image\/jpeg|image\/png|image\/jpg)$/}),
          ],
        }),
      )
      file: Express.Multer.File,) {
        return this.cloudinaryService.uploadFile(file);
    }
}