//recipeModel.js

import db from './db.js';

const newRecipe = async ({ name, discription, recipe, alcohol, image, ingredients, items, userId }) => {
    const [result] = await db.execute(
        'INSERT INTO recipes (user_id, name, discription, recipe, alcohol, image, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())',
        [userId, name, discription, recipe, alcohol, image]
    );

    const recipe_id = result.id;

    for (const ingredient_id of ingredients) {
        await db.execute(
            'INSERT INTO recipes_ingredients (recipe_id, ingredient_id) VALUES (?, ?)', 
            [recipe_id, ingredient_id]
        );
    }

    for (const item_id of items) {
        await db.execute(
            'INSERT INTO recipes_ingredients (recipe_id, ingredient_id) VALUES (?, ?)', 
            [recipe_id, item_id]
        );
    }

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