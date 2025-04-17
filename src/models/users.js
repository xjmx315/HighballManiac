//users.js

import db from './db.js';

const getIdByName = async (name) => {
    /*name이 일치하는 유저가 있으면 키를 반환. 없으면 null 반환*/
    const queryResult = await db.execute(
        'SELECT id FROM users WHERE name = ?',
        [name]
    );
    console.log(queryResult);
};

export default {
    getIdByName: getIdByName
}