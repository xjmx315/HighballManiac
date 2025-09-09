//app.js
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';

import logger from './middlewares/logger.js';
import apiRouter from './routes/apiRouter.js';
import errorHandler from './middlewares/errorHandler.js';
import { ensureDB } from './models/db.js';

// 환경 변수
dotenv.config();

//csv seed 폴더
const __dirname = path.resolve();
const csvPath = path.join(__dirname, process.env.CSVPATH || 'csvFiles');
if (!fs.existsSync(csvPath)) {
    fs.mkdirSync(csvPath);
}

//DB pool
ensureDB().then((value) => {
    if (value) {
        console.error(value);
        process.exit(1);
    }
});

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

app.use((req, res, next) => {
    const err = new Error(`Not Found: ${req.method} ${req.originalUrl}`);
    err.status = 404;
    next(err);
});

app.use(errorHandler);

export default app;