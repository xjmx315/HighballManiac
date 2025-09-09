//db.js

/*
db pool을 생성하고 health check 인터페이스를 제공합니다. 
getPool - pool 객체를 얻습니다. 
getSetting - 연결 정보 객체를 얻습니다. 
testConnection - 현재 pool을 검사합니다. 연결이 불가능하면 에러를 던집니다. 
ensureDB - 현재 pool을 검사하고 수정 가능한 에러를 고칩니다. 정상적으로 연결이 되었다면 0을 리턴합니다. 
*/
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

let pool = mysql.createPool(dbSetting);

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

const _testConnection = async (pool) => {
    console.log('DB connecting...');
    const [rows] = await pool.execute('SELECT 1'); 
    console.log('DB 연결 성공 (SELECT 1)', rows);
};

const testConnection = async () => {
    await _testConnection(pool);
}

const ensureDB = async () => {
    try {
        // 연결 테스트
        await _testConnection(pool);
        return 0;
    } catch (err) {
        console.error('DB 연결 실패:', err);

        if (err.message.startsWith('Unknown database')) {
            console.log('Unknown database: DB 스키마 생성 작업 시도...');
            await pool.end();
            try {
                await createSchema(dbSetting);
            }
            catch (err) {
                console.error('스키마 생성을 시도했지만 실패했습니다. ');
                return (err);
            }

            //2차 검증
            const newPool =  mysql.createPool(dbSetting);
            try {
                await _testConnection(newPool);
                pool = newPool;
                return 0;
            }
            catch (err) {
                console.error("DB 초기화에 성공했지만 알 수 없는 이유로 연결이 거부되었습니다. ");
                return err;
            }
        } else {
            console.log('DB Info:', dbSetting);
            return new Error('DB에 연결할 수 없습니다. 설정 또는 인터넷 연결이 문제일 수 있습니다. ');
        }
    }
};

const getPool = () => {
    return pool;
}

const getSetting = () => {
    return dbSetting;
}


export { 
    getPool, 
    getSetting, 
    ensureDB, 
    testConnection
};