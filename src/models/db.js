//db.js
import mysql from 'mysql2';

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

export default db;