// 패키지 로드
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';

import logger from './middlewares/logger.js';
import apiRouter from './routes/apiRouter.js';

// 환경 변수 로드
dotenv.config();

// express obj 생성
const app = express();

// 포트 설정
const PORT = process.env.PORT || 3000;

//미들웨어 플로우
if (process.env.DEV){
    app.use(cors());
}
else{
    app.use(cors({
        origin: process.env.REACT_ORIGIN
    }));
}

app.use(express.json());
app.use(logger);

app.get('/', (req, res) => {
    res.send('hi~');
});

app.use('/api', apiRouter);

// 서버 실행
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});