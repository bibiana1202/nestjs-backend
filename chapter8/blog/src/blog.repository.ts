import { readFile, writeFile } from 'fs/promises'; // 파일을 읽고 쓰는 모듈 임포트
import { PostDto } from './blog.model';

// 블로그 리포지토리 인터페이스 정의
export interface BlogRepository {
    getAllPost(): Promise<PostDto[]>;
    createPost(postDto: PostDto);
    getPost(id: String): Promise<PostDto>;
    deletePost(id: String);
    updatePost(id: String, postDto: PostDto);
}

// BlogRepository 를 구현한 클래스. 파일을 읽고 쓰기
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
        const createPost = { id: id.toString(), ...rest, createdDt: new Date() };
        posts.push(createPost);
        await writeFile(this.FILE_NAME, JSON.stringify(posts));
    }

    // 게시글 하나 가져오기
    async getPost(id: string): Promise<PostDto> {
        const posts = await this.getAllPost();
        const result = posts.find((post) => post.id === id);
        if (!result) {
            throw new Error(`Post with id ${id} not found`);
        }
        return result;
    }

    // 게시글 하나 삭제
    async deletePost(id: string) {
        const posts = await this.getAllPost();
        const filteredPosts = posts.filter((post) => post.id !== id);
        await writeFile(this.FILE_NAME, JSON.stringify(filteredPosts));
    }

    // 게시글 하나 수정하기
    async updatePost(id: string, postDto: PostDto) {
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
