import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column({ unique: true })
    email: string;

    @Column({ nullable: true }) // 패스워드에 빈 값 허용
    password: string;

    @Column()
    username: string;

    @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
    createdDt: Date = new Date();

    @Column({ nullable: true }) // providerId에 빈값 허용
    providerId: string; // providerId 추가
}