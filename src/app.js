//app.js
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';

import logger from './middlewares/logger.js';
import apiRouter from './routes/apiRouter.js';

// 환경 변수 로드
dotenv.config();

//폴더 생성
const __dirname = path.resolve();
const csvPath = path.join(__dirname, process.env.CSVPATH || 'csvFiles');
if (!fs.existsSync(csvPath)) {
    fs.mkdirSync(csvPath);
}

// express obj 생성
const app = express();

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

app.use('/api', apiRouter);

export default app;