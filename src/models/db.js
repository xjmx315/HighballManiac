//db.js
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const dbSetting = {
    host: process.env.DBHOST,
    port: process.env.DBPORT,
    user: process.env.DBUSERNAME,
    password: process.env.DBPASSWORD,
    database: process.env.DBNAME,
    connectionLimit: 10
};

const createSchema = async (dbSetting) => {
    //DB 이름 없이 연결
    const dbSettingWithoutDBName = JSON.parse(JSON.stringify(dbSetting));
    delete dbSettingWithoutDBName.database;
    const pool = mysql.createPool(dbSettingWithoutDBName);

    //DB(schema) 생성
    const result = await pool.execute(`CREATE DATABASE ${process.env.DBNAME};`);
    console.log(result);
    await pool.end();
    return result;
};

const testConnection = async (pool) => {
    console.log('DB connecting...');
    const [rows] = await pool.execute('SELECT 1'); 
    console.log('DB 연결 성공 (SELECT 1)', rows);
};

const ensureDB = async (dbSetting) => {
    const pool = mysql.createPool(dbSetting);
    try {
        // 연결 테스트
        await testConnection(pool);
        return pool;
    } catch (err) {
        console.error('DB 연결 실패:', err);

        if (err.message.startsWith('Unknown database')) {
            console.log('DB 초기화 작업 실행...');
            await pool.end();
            try {
                await createSchema(dbSetting);
            }
            catch (err) {
                console.error('DB 초기화를 시도했지만 실패했습니다. ');
                throw err;
            }

            //2차 검증
            const newPool =  mysql.createPool(dbSetting);
            try {
                await testConnection(newPool);
                return newPool;
            }
            catch (err) {
                console.error("DB 초기화에 성공했지만 알 수 없는 이유로 연결이 거부되었습니다. ");
                throw err;
            }
        } else {
            console.log('DB Info:', dbSetting);
            throw new Error('DB에 연결할 수 없습니다. 설정을 확인하세요. ');
        }
    }
};

const pool = await ensureDB(dbSetting);

export default pool;