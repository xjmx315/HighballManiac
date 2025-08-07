//tagModel.js

import db from './db.js';

const searchTags = async (searchTerm) => {
    const [result] = await db.execute("SELECT * FROM tags WHERE name LIKE ?;", [`%${searchTerm}%`]);
    return result;
};

const getById = async (id) => {
    const [result] = await db.execute("SELECT * FROM tags WHERE id=?;", [id]);
    return result;
}

export default {
    searchTags,
    getById
};