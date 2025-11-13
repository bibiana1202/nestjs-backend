import { Controller, Get, Post, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AppService } from './app.service';
import { multerOption } from './multer.option';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('file-upload') // POST 메서드로 localhost:3000/file-upload 호출시 동작
  @UseInterceptors(FileInterceptor('file', multerOption)) // 파일 인터셉터
  fileUpload(@UploadedFile() file: Express.Multer.File) { // 인터셉터에서 준 파일을 받음
    // console.log(file.buffer.toString('utf-8')); // 텍스트 파일 내용 출력
    console.log(file);
    // return 'File Upload';
    return `${file.originalname} File Uploaded check http://localhost:3000/uploads/${file.filename}`;
  }
}
