//seedManager.js

import db from './db.js';
import {readFile, writeFile} from 'fs/promises';
import {createReadStream} from 'fs';
import path from 'path';
import { Parser } from 'json2csv';
import dotenv from 'dotenv';
import csv from 'csv-parser';

dotenv.config();

const schemaVer = process.env.SCHEMA_VER || '0';

const _isArrayEqual = (arr1, arr2) => {
  return  arr1.length === arr2.length && arr1.every((val, ind) => val === arr2[ind]);
}

const _deleteData = async (tableName) => {
  //테이블에 있는 모든 데이터를 지운다. 
  try {
    const response = await db.execute(`DELETE FROM ${tableName}`);
    console.log(`succeed to delete ${tableName}. return data: ${response} (end)`);
    return true;
  }
  catch (e) {
    console.log(`error on _deleteData\nTableName: ${tableName}\n${e}`);
    return false;
  }
};

const _updateTablefromCsv = async (tableName, filePath) => {
  //csv파일에 있는 데이터를 테이블에 추가한다. 기존 데이터는 유지된다. 
  console.log(tableName, filePath);

  const tableInfo = await db.query(`DESCRIBE ${tableName};`);
  const columnsFromTable = tableInfo[0].map(row => {return row.Field});
  console.log('header form table');
  console.log(columnsFromTable);

  //테이블에서 행 정보 구하기
  return new Promise((resolve, reject) => {
    //처리 실패 행
    const faildRows = [];

    //데이터 삽입
    try{
      createReadStream(filePath, 'utf8')
        .pipe(csv())
        .on('headers', (headers) => {
          console.log('header form csv: ');
          console.log(headers);
          if (!_isArrayEqual(columnsFromTable, headers)){
            return reject(new Error('업로드 된 파일의 column과 table의 column이 일치하지 않습니다. '));
          }
        })
        .on('data', async (row) => {
          try {
            const data = columnsFromTable.map(v => {return row[v]});
            console.log('query: ', `INSERT INTO ${tableName} (${columnsFromTable.join(', ')}) VALUES (${Array(columnsFromTable.length).fill('?').join(', ')})`);
            console.log(data);
            await db.execute(
              `INSERT INTO ${tableName} (${columnsFromTable.join(', ')}) VALUES (${Array(columnsFromTable.length).fill('?').join(', ')})`,
              data
            );
          }
          catch (e) {
            console.error('삽입 실패: ');
            console.log(row);
            console.log(e);
            faildRows.push(row);
          }
        })
        .on('end', () => {
          console.log('CSV file successfully processed');
        })
        .on('error', (e) => {
          return reject(e);
        });
      return resolve(faildRows);
    }
    catch(e){
      console.log(`error on _updateTablefromCsv\n${e}`);
      return reject(e);
    }
  });
};

const _exportTabletoCsv = async (tableName, filePath) => {
  //테이블에 있는 데이터를 csv 파일로 추출한다. csv file path를 리턴한다. 
  try{
    //csvData 얻기
    const [rows] = await db.query(`SELECT * FROM ${tableName}`);
    if (rows.length === 0){
      return -1;
    }
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
    return 0;
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

  //테이블 초기화
  result.push(await executeSqlFile('./src/models/sql/clear.sql', db));
  result.push(await executeSqlFile('./src/models/sql/schema.sql', db));
  
  //seed 삽입
  await _updateTablefromCsv('users', './seeds/Users_seed.csv');
  await _updateTablefromCsv('ingredients', './seeds/Ingredients_seed.csv');
  await _updateTablefromCsv('items', './seeds/Items_seed.csv');
  await _updateTablefromCsv('items_ingredients', './seeds/Items_Ingredients_seed.csv');

  return result;
};

export default {
    initDB,
    _deleteData,
    _exportTabletoCsv,
    _updateTablefromCsv
};