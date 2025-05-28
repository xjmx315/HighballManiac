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

const initDB = async () => {
  await executeSqlFile('../sql/clear.sql', db);
  await executeSqlFile('../sql/schema.sql', db);
  await executeSqlFile('../sql/seed.sql', db);
};

export default {
    initDB: initDB
};