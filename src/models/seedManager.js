//seedManager.js

import db from './db.js';

const checkDB = async () => {
    //db에 필요한 테이블이 모두 있는지 확인한다. 
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