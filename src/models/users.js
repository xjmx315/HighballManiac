//users.js

import db from './db.js';

const getIdByName = async (name) => {
    /*name이 일치하는 유저가 있으면 키를 반환. 없으면 [] 반환*/
    const [ids] = await db.execute(
        'SELECT id FROM users WHERE name = ?',
        [name]
    );
    return ids;
};

const getPasswordById = async (id) => {
    const [password] = await db.execute(
        'SELECT password FROM users WHERE id = ?',
        [id]
    );
    return password;
};


const addUser = async (email, hashedPassword, name) => {
    const [result] = await db.execute(
        'INSERT INTO users (email, password, name, created_at) VALUES (?, ?, ?, NOW())',
        [email, hashedPassword, name]
    );
    return result;
};

export default {
    getIdByName: getIdByName,
    getPasswordById: getPasswordById,
    addUser: addUser
}