import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('posts')
export class Post {
    // 기본키, 자동증가
    @PrimaryGeneratedColumn()
    id: number;

    // 글 제목
    @Column({ length: 200 })
    title: string;

    // 글 내용 (text 타입)
    @Column({ type: 'text' })
    content: string;

    // 작성자 이름
    @Column({ length: 50 })
    name: string;

    // 생성일
    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    createdDt: Date;

    // 수정일 (nullable 허용)
    @Column({ type: 'datetime', nullable: true })
    updateDt: Date | null;

}