//recipeModel.js

import db from './db.js';

const newRecipe = async ({ name, discription, recipe, alcohol, ingredients, items, userId }) => {
    const [result] = await db.execute(
        'INSERT INTO recipes (name, discription, recipe, alcohol, image, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
        [name, discription, recipe, alcohol, ingredients, items, userId]
    );
    return result;
};

const getById = async (id) => {
    const [recipe] = await db.execute(
        'SELECT * FROM recipes WHERE id = ?',
        [id]
    );
    return recipe;
};

const searchRecipeByName = async (name) => {
    const [recipe] = await db.execute(
        'SELECT * FROM recipes WHERE name = ?',
        [name]
    );
    return recipe;
};

export default {
    newRecipe,
    getById,
    searchRecipeByName
}