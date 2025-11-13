import { randomUUID } from 'crypto';
import { diskStorage } from "multer";
import { extname, join } from 'path';

export const multerOption = { // multerOption 객체 선언
    storage: diskStorage({  // 디스크 스토리지 사용
        destination: join(__dirname, '..', 'uploads'), // 파일 저장 경로 설정
        filename: (req, file, cb) => { // 파일명 설정
            cb(null, randomUUID() + extname(file.originalname));
        },
    }),
};