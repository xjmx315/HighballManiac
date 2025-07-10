//ingredientsModel.js

import db from './db.js';

const newIngredient = async ({name, description, image}) => {
    const result = await db.execute(
        'INSERT INTO ingredients (name, description, image) VALUES (?, ?, ?)',
        [name, description, image]
    );
    return result;
}

const searchIngredientByName = async (searchTerm) => {
    try{
        const [results] = await db.query('SELECT * FROM ingredients WHERE name LIKE ?', [`%${searchTerm}%`]);
        return results;
    }
    catch(err){
        console.error('쿼리 실패: ', err);
        return err;
    }
}

const getById = async (id) => {
    try{
        const [results] = await db.query('SELECT * FROM ingredients WHERE id=?', [id]);
        return results;
    }
    catch(err){
        console.error('쿼리 실패: ', err);
        return err;
    }
}

export default {
    newIngredient,
    searchIngredientByName,
    getById
}