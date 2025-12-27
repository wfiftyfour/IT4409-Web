import { Module, forwardRef } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { MaterialModule } from '../material/material.module';
import { ChatModule } from '../chat/chat.module';

@Module({
  imports: [forwardRef(() => MaterialModule), ChatModule],
  providers: [UploadService],
  controllers: [UploadController],
  exports: [UploadService],
})
export class UploadModule {}
