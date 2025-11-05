import { Module } from '@nestjs/common';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';
import { Post } from './post.entity';
import { TypeOrmModule } from "@nestjs/typeorm";
import { BlogDbRepository, BlogFileRepository } from './blog.repository';

@Module({
    imports: [TypeOrmModule.forFeature([Post])],
    controllers: [BlogController],
    providers: [BlogService, BlogFileRepository, BlogDbRepository],

})
export class BlogModule { }