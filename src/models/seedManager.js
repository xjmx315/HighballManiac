//seedManager.js

import db from './db.js';
import {readFile} from 'fs/promises';
import path from 'path';

const executeSqlFile = async (filePath, connection) => {
  try {
    const sql = await readFile(filePath, 'utf8');
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

const initDB = async () => {
  await executeSqlFile('./src/models/sql/clear.sql', db);
  await executeSqlFile('./src/models/sql/schema.sql', db);
  await executeSqlFile('./src/models/sql/seed.sql', db);
};

export default {
    initDB: initDB
};