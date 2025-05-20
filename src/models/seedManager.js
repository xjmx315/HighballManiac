//seedManager.js

import db from './db.js';

const executeSqlFile = async (filePath, connection) => {
    try {
      const sql = await fs.readFile(filePath, 'utf8');
      // 여러 쿼리를 세미콜론으로 분리
      const queries = sql.split(';').filter((query) => query.trim());
      for (const query of queries) {
        await connection.query(query);
      }
      console.log(`Successfully executed ${path.basename(filePath)}`);
    } catch (error) {
      console.error(`Error executing ${path.basename(filePath)}:`, error.message);
      throw error;
    }
};

const checkDB = async (connection) => {
    try {
      const [rows] = await connection.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = ? 
        AND table_name IN ('users', 'posts')
      `, [dbConfig.database]);//이거 없음
  
      const existingTables = rows.map((row) => row.table_name);
      console.log('Existing tables:', existingTables);
  
      return {
        hasUsersTable: existingTables.includes('users'),
        hasPostsTable: existingTables.includes('posts'),
      };
    } catch (error) {
      console.error('Error checking database state:', error.message);
      throw error;
    }
};

const initDB = async () => {
    //sql 파일을 가지고 있다가 그걸 불러와서 실행하는 것이 좋지 않을까
    //users 테이블 생성
    db.query('create table users (id int auto_increment primary key, email varchar(127), password varchar(225) not null, name varchar(127) not null unique, created_at datetime not null);');

    //items 태이블 생성
    db.query('create table items (id int auto_increment primary key, name varchar(127), description varchar(225), image varchar(225));');

};

export default {
    initDB: initDB
};