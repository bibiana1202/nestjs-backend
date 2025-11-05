import { readFile, writeFile } from 'fs/promises'; // 파일을 읽고 쓰는 모듈 임포트
import { PostDto } from './blog.model';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Blog, BlogDocument } from './blog.schema';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { Repository } from 'typeorm';

// 블로그 리포지토리 인터페이스 정의
export interface BlogRepository {
    getAllPost(): Promise<PostDto[]>;
    createPost(postDto: PostDto);
    getPost(id: number): Promise<PostDto>;
    deletePost(id: number);
    updatePost(id: number, postDto: PostDto);
}

// BlogRepository 를 구현한 클래스. 파일을 읽고 쓰기
@Injectable()
export class BlogFileRepository implements BlogRepository {
    FILE_NAME = './src/blog.data.json';

    // 파일을 읽어서 모든 게시글 불러오기
    async getAllPost(): Promise<PostDto[]> {
        const datas = await readFile(this.FILE_NAME, 'utf8');
        const posts = JSON.parse(datas);
        return posts;
    }

    // 게시물 쓰기
    async createPost(postDto: PostDto) {
        const posts = await this.getAllPost();
        const id = posts.length + 1;
        // dto 안에 id가 있어도 여기서는 무시
        const { id: _ignored, ...rest } = postDto;
        const createPost = { id: id, ...rest, createdDt: new Date() };
        posts.push(createPost);
        await writeFile(this.FILE_NAME, JSON.stringify(posts));
    }

    // 게시글 하나 가져오기
    async getPost(id: number): Promise<PostDto> {
        const posts = await this.getAllPost();
        const result = posts.find((post) => post.id === id);
        if (!result) {
            throw new Error(`Post with id ${id} not found`);
        }
        return result;
    }

    // 게시글 하나 삭제
    async deletePost(id: number) {
        const posts = await this.getAllPost();
        const filteredPosts = posts.filter((post) => post.id !== id);
        await writeFile(this.FILE_NAME, JSON.stringify(filteredPosts));
    }

    // 게시글 하나 수정하기
    async updatePost(id: number, postDto: PostDto) {
        const posts = await this.getAllPost();
        const index = posts.findIndex((post) => post.id === id);
        // dto 안의 id는 버림
        const { id: _ignored, ...rest } = postDto;
        const updatePost = {
            ...posts[index], // 기존 게시글의 전체 내용 복사
            ...rest,         // 새로 들어온 수정 내용으로 덮어쓰기
            id,              // id 는 유지
            updatedDt: new Date()
        };
        posts[index] = updatePost;
        await writeFile(this.FILE_NAME, JSON.stringify(posts));
    }
}

// 몽고디비용 리포지토리
@Injectable()
export class BlogMongoRepository implements BlogRepository {
    // Model<BlogDocument> 타입인 blogModel 주입
    constructor(@InjectModel(Blog.name) private blogModel: Model<BlogDocument>) { }

    // 모든 게시글을 읽어오는 함수
    async getAllPost(): Promise<PostDto[]> {
        return await this.blogModel.find().exec();
    }

    // 게시글 작성
    async createPost(postDto: PostDto) {
        const createPost = {
            ...postDto,
            createdDt: new Date(),
            updatedDt: new Date(),
        };
        this.blogModel.create(createPost);

    }
    // 하나의 게시글 읽기
    async getPost(id: number): Promise<PostDto> {
        const post = await this.blogModel.findById(id);
        if (!post) {
            throw new NotFoundException(`Post with id ${id} not found`);
        }
        return post;
    }

    // 하나의 게시글 삭제
    async deletePost(id: number) {
        await this.blogModel.findByIdAndDelete(id);
    }

    // 게시글 업데이트
    async updatePost(id: number, postDto: PostDto) {
        const posts = await this.getAllPost();
        const index = posts.findIndex((post) => post.id === id);
        const { id: _ignored, ...rest } = postDto;
        const updatePost = {
            ...posts[index],
            ...rest,
            id,
            updatedDt: new Date()
        };
        await this.blogModel.findByIdAndUpdate(id, updatePost);
    }
}

@Injectable()
export class BlogDbRepository implements BlogRepository {
    constructor(@InjectRepository(Post) private readonly postRepo: Repository<Post>,) { }

    // 전체 조회
    async getAllPost(): Promise<PostDto[]> {
        return await this.postRepo.find({
            order: { id: 'DESC' },
        });
    }
    // 단일 조회
    async getPost(id: number): Promise<PostDto> {
        const post = await this.postRepo.findOne({
            where: { id: Number(id) }
        });
        if (!post) {
            throw new NotFoundException(`Post with id ${id} not found`);
        }
        return post;
    }
    // 게시물 작성
    async createPost(postDto: PostDto) {
        const createPost = {
            ...postDto,
            createdDt: new Date(),
            updatedDt: new Date(),
        };
        this.postRepo.save(createPost);
    }
    // 게시물 수정
    async updatePost(id: number, postDto: PostDto) {
        console.log(id);
        console.log(typeof id);  // "string" 이라면 문제야
        const { id: _ignored, ...rest } = postDto;
        const numericId = Number(id);
        const updatePost = await this.postRepo.preload({
            id: numericId,
            ...rest,
            updateDt: new Date(),
        });

        if (!updatePost) {
            throw new Error(`Post with id ${id} not found`);
        }

        await this.postRepo.save(updatePost);
    }
    // 게시물 삭제
    async deletePost(id: number) {
        const result = await this.postRepo.delete(Number(id));
        if (result.affected === 0) {
            throw new NotFoundException(`Post with id ${id} not found`);
        }
    }

}