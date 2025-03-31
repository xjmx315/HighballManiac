// 패키지 로드
import dotenv from 'dotenv';
import express from 'express';
import mysql from 'mysql2';

import logger from './middlewares/logger.js';

// 환경 변수 로드
dotenv.config();

// express obj 생성
const app = express();

// 포트 설정
const PORT = process.env.PORT || 3000;

//db 연결
const db = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: process.env.DBUSERNAME,
    password: process.env.DBPASSWORD,
    database: 'highball_maniac'
});

db.connect((err) => {
    if (err){
        console.error('db 연결 실패:', err);
        return;
    }
    console.log('db 연결 성공!');
});

//미들웨어 플로우
app.use(express.json());
app.use(logger)

app.get('/', (req, res) => {
    res.send('hi~');
});

app.get('/items', (req, res) => {
    db.query('SELECT * FROM items', (err, result) => {
        if (err){
            console.error('쿼리 오류: ', err);
            res.status(500).send('서버 오류 - 쿼리 오류');
            return;
        }
        res.json(result);
    })
})

// 서버 실행
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});