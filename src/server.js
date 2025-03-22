// 패키지 로드
import dotenv from 'dotenv';
import express from 'express';

// 환경 변수 로드
dotenv.config();

// express obj 생성
const app = express();

// 포트 설정
const PORT = process.env.PORT || 3000;

// 기본 라우팅
app.get('/', (req, res) => {
    res.send('hi~');
});

// 서버 실행
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});