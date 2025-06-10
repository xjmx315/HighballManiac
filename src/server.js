//server.js

import app from './app.js';
import dotenv from 'dotenv';

//포트 설정
dotenv.config();
const PORT = process.env.PORT || 3000;

// 서버 실행
const server = app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});