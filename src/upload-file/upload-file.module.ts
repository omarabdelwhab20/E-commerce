import { Module } from '@nestjs/common';
import { UploadFileService } from './upload-file.service';
import { CloudinaryProvider } from './cloudinary.provider';
import { UploadFileController } from './upload-file.controller';

@Module({
  controllers : [UploadFileController],
  providers: [UploadFileService, CloudinaryProvider],
  exports: [UploadFileService, CloudinaryProvider]

})
export class UploadFileModule {}
