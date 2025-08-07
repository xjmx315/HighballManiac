//recipeModel.js

import db from './db.js';

const newRecipe = async ({ name, description, recipe, alcohol, image, ingredients, items, userId }) => {
    const [result] = await db.execute(
        'INSERT INTO recipes (user_id, name, description, recipe, alcohol_percentage, image, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())',
        [userId, name, description, recipe, alcohol, image]
    );

    const recipe_id = result.insertId;

    for (const ingredient_id of ingredients) {
        await db.execute(
            'INSERT INTO recipes_ingredients (recipe_id, ingredient_id) VALUES (?, ?)', 
            [recipe_id, ingredient_id]
        );
    }

    for (const item_id of items) {
        await db.execute(
            'INSERT INTO recipes_items (recipe_id, item_id) VALUES (?, ?)', 
            [recipe_id, item_id]
        );
    }

    return result;
};

const addTag = async (recipeId, tagId) => {
    const [result] = await db.execute(
        'INSERT INTO recipes_tags (recipe_id, tag_id) VALUES (?, ?);', [recipeId, tagId]);
    return result;
};

const getById = async (id) => {
    const [recipe] = await db.execute(
        'SELECT * FROM recipes WHERE id = ?;',
        [id]
    );
    return recipe;
};

const getTags = async (id) => {
    const [tags] = await db.execute(
        'SELECT T.* FROM recipes_tags AS RT JOIN tags AS T ON RT.tag_id = T.id WHERE RT.recipe_id = ?;',
        [id]
    );
    return tags;
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
    addTag,
    getById,
    getTags,
    searchRecipeByName
}