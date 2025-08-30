//recipeModel.js

import db from './db.js';

const newRecipe = async ({ name, description, recipe, alcohol, image, ingredients, items, userId, tags }) => {
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

    for (const tag_id of tags) {
        await db.execute(
            'INSERT INTO recipes_tags (recipe_id, tag_id) VALUES (?, ?)', 
            [recipe_id, tag_id]
        );
    }

    return result;
};

const addTag = async (recipeId, tagId) => {
    const [result] = await db.execute(
        'INSERT INTO recipes_tags (recipe_id, tag_id) VALUES (?, ?);', [recipeId, tagId]);
    return result;
};

const deleteTag = async (recipeId, tagId) => {
    const [result] = await db.execute(
        'DELETE FROM recipes_tags WHERE recipe_id = ? AND tag_id = ?;', [recipeId, tagId]);
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

const getItems = async (id) => {
    const [items] = await db.execute(
        'SELECT I.* FROM recipes_items AS RI JOIN items AS I ON RI.item_id = I.id WHERE RI.recipe_id = ?;',
        [id]
    );
    return items;
};

const getIngredients = async (id) => {
    const [ingredients] = await db.execute(
        'SELECT I.* FROM recipes_ingredients AS RI JOIN ingredients AS I ON RI.ingredient_id = I.id WHERE RI.recipe_id = ?;',
        [id]
    );
    return ingredients;
};

const searchRecipeByName = async (name) => {
    const [recipe] = await db.execute(
        'SELECT * FROM recipes WHERE name = ?',
        [name]
    );
    return recipe;
};

const searchByIngredient = async (items, ingredients) => {
    if ((!items || items.length === 0) && (!ingredients || ingredients.length === 0)) {
        return [];
    }

    //동적 플레이스홀더
    const itemsPlaceholders = items && items.length > 0 ? items.map(() => '?').join(',') : 'NULL';
    const ingredientsPlaceholders = ingredients && ingredients.length > 0 ? ingredients.map(() => '?').join(',') : 'NULL';

    const query = `
        SELECT
        r.id,
        r.name,
        r.image,
        COUNT(DISTINCT joined_items.id, joined_items.type) AS matched_count
        FROM
        recipes r
        INNER JOIN (
        -- 사용자가 제공한 재료(ingredients)와 레시피의 관계
        SELECT ri.recipe_id, ri.ingredient_id AS id, 'ingredient' AS type
        FROM recipes_ingredients ri
        WHERE ri.ingredient_id IN (${ingredientsPlaceholders})
        UNION
        -- 사용자가 제공한 아이템(items)과 레시피의 관계
        SELECT ritem.recipe_id, ritem.item_id AS id, 'item' AS type
        FROM recipes_items ritem
        WHERE ritem.item_id IN (${itemsPlaceholders})
        UNION
        -- 재료의 상위 개념인 아이템과 레시피의 관계
        SELECT ritem_ingredient.recipe_id, ritem_ingredient.item_id AS id, 'item' AS type
        FROM items_ingredients ii
        JOIN recipes_items ritem_ingredient ON ii.item_id = ritem_ingredient.item_id
        WHERE ii.ingredient_id IN (${ingredientsPlaceholders})
        ) AS joined_items ON r.id = joined_items.recipe_id
        GROUP BY
        r.id
        ORDER BY
        matched_count DESC;`

    const params = [
        ...(ingredients || []),
        ...(items || []),
        ...(ingredients || [])
    ];

    const [recipe] = await db.execute(query, params);
    return recipe;
};

const getByUserId = async (id) => {
    const [recipe] = await db.execute(
        'SELECT name, id, image FROM recipes WHERE user_id = ?',
        [id]
    );
    return recipe;
};

const getNewest = async () => {
    const [recipe] = await db.execute(
        'SELECT name, id, image FROM highball_maniac.recipes ORDER BY id DESC LIMIT 4;');
    return recipe;
};

export default {
    newRecipe,
    addTag,
    deleteTag,
    getById,
    getTags,
    getItems, 
    getIngredients, 
    searchRecipeByName,
    searchByIngredient,
    getByUserId,
    getNewest
}