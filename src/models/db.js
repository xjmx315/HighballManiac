//db.js
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
    host: 'localhost',
    port: 3306,
    user: process.env.DBUSERNAME,
    password: process.env.DBPASSWORD,
    database: 'highball_maniac',
    connectionLimit: 10
});

/* 콜백 기반 mysql 사용시
db.connect((err) => {
    if (err){
        console.error('db 연결 실패:', err);
        return;
    }
    console.log('db 연결 성공!');
});
*/
export default pool;