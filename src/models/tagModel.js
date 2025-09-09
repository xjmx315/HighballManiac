//tagModel.js

import {getPool} from './db.js';

const db = getPool();

const searchTags = async (searchTerm) => {
    const [result] = await db.execute("SELECT * FROM tags WHERE name LIKE ?;", [`%${searchTerm}%`]);
    return result;
};

const getById = async (id) => {
    const [result] = await db.execute("SELECT * FROM tags WHERE id=?;", [id]);
    return result;
};

const getRecipes = async (id) => {
    const [recipes] = await db.execute(
        "SELECT R.* FROM recipes_tags AS RT JOIN recipes AS R ON RT.recipe_id = R.id WHERE RT.tag_id = ?;", [id]);
    return recipes;
};

const getAllTags = async () => {
    const [recipes] = await db.execute("SELECT * FROM tags;");
    return recipes;
};

export default {
    searchTags,
    getById,
    getRecipes,
    getAllTags
};