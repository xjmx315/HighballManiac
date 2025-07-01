//seedManager.js

import db from './db.js';
import {readFile, writeFile} from 'fs/promises';
import path from 'path';
import { Parser } from 'json2csv';
import dotenv from 'dotenv';

dotenv.config();

const schemaVer = process.env.SCHEMA_VER || '0';

const _deleteData = async (tableName) => {
  //테이블에 있는 모든 데이터를 지운다. 
  try {
    const response = await db.execute("TRUNCATE TABLE ?", [tableName]);
    console.log(`succeed to delete ${tabelName}. return data: ${response} (end)`)
  }
  catch (e) {
    console.log(`error on _deleteData\nTableName: ${tableName}\n${e}`);
  }
};

const _updateTablefromCsv = async (tableName, filePath) => {
  //csv파일에 있는 데이터를 테이블에 추가한다. 기존 데이터는 유지된다. 
};

const _exportTabletoCsv = async (tableName, filePath) => {
  //테이블에 있는 데이터를 csv 파일로 추출한다. csv file path를 리턴한다. 
  try{
    //csvData 얻기
    const [rows] = await db.query(`SELECT * FROM ${tableName}`);
    const csvParser = new Parser();
    const csvData = csvParser.parse(rows);

    //fileName 얻기
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const date = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    const fileName = `${tableName}_${year}${month}${date}_${hours}${minutes}${seconds}_${schemaVer}.csv`;

    //csv 저장
    await writeFile(path.join(filePath, fileName), csvData, 'utf8');
    return fileName;
  }
  catch (e) {
    console.log(`error on _exportTabletoCsv ${e}`);
    return '';
  }
};

const executeSqlFile = async (filePath, connection) => {
  try {
    const sql = await readFile(filePath, 'utf8');
    const queries = sql.split(';').filter((query) => query.trim());
    for (const query of queries) {
      try {
        await connection.query(query);
      }
      catch (e) {
        console.log("SQL query error: ", query);
        throw e;
      }
    }
    console.log(`Successfully executed ${path.basename(filePath)}`);
  } catch (error) {
    console.error(`Error executing ${path.basename(filePath)}:`, error.message);
    throw error;
  }
  return filePath;
};

const initDB = async () => {
  const result = [];

  result.push(await executeSqlFile('./src/models/sql/clear.sql', db));
  result.push(await executeSqlFile('./src/models/sql/schema.sql', db));
  result.push(await executeSqlFile('./src/models/sql/seed.sql', db));

  return result;
};

export default {
    initDB: initDB,
    _deleteData,
    _exportTabletoCsv,
    _updateTablefromCsv
};