import { Module } from '@nestjs/common';
import { BlogController } from './blog/blog.controller';
import { BlogService } from './blog/blog.service';
import { BlogFileRepository } from './blog/blog.repository';
import { BlogMongoRepository } from './blog/blog.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from './blog/blog.schema';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogModule } from './blog/blog.module';

@Module({
  imports: [
    // // 몽고디비 연결 설정
    // MongooseModule.forRoot(),
    // MongooseModule.forFeature([{name:Blog.name,schema:BlogSchema}],
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3308,
      username: 'root',
      password: '1234',
      database: 'nestdb',
      autoLoadEntities: true,
      synchronize: true,
    }),
    BlogModule,
  ],
  // controllers: [BlogController],
  // providers: [BlogService, BlogFileRepository], // 프로바이더 설정
})
export class AppModule { }
