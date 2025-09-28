//recipeModel.js

import {getPool} from './db.js';
import { NotFoundError } from '../errors/CommonError.js';

const db = getPool();

const newRecipe = async ({ name, description, recipe, alcohol, image, ingredients, items, userId, tags }) => {
    //트랜잭션 사용
    //TODO: 확장 삽입
    const conn = await db.getConnection();
    await conn.beginTransaction();

    let insertId;
    try {
        const [result] = await conn.execute(
            'INSERT INTO recipes (user_id, name, description, recipe, alcohol_percentage, image, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())',
            [userId, name, description, recipe, alcohol, image]
        );
    
        const recipe_id = result.insertId;
        insertId = result.insertId;

        for (const ingredient_id of ingredients) {
            await conn.execute(
                'INSERT INTO recipes_ingredients (recipe_id, ingredient_id) VALUES (?, ?)', 
                [recipe_id, ingredient_id]
            );
        }
    
        for (const item_id of items) {
            await conn.execute(
                'INSERT INTO recipes_items (recipe_id, item_id) VALUES (?, ?)', 
                [recipe_id, item_id]
            );
        }
    
        for (const tag_id of tags) {
            await conn.execute(
                'INSERT INTO recipes_tags (recipe_id, tag_id) VALUES (?, ?)', 
                [recipe_id, tag_id]
            );
        }

        await conn.commit();
    }
    catch (e) {
        console.error("newRecipe: ", e);
        await conn.rollback();
        throw e;
    }
    finally {
        conn.release();
    }

    return insertId;
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

const setTags = async (recipeId, tagListTo) => {
    //트랜잭션
    const conn = await db.getConnection();
    await conn.beginTransaction();

    try {
        //일괄 삭제
        await conn.execute('DELETE FROM recipes_tags WHERE recipe_id = ?;', [recipeId]);
        //확장 삽입
        //동적 플레이스홀더
        const placeholders = tagListTo && tagListTo.length > 0 ? tagListTo.map(() => `(${recipeId}, ?)`).join(',') : 'NULL';
        const insertQuery = `INSERT INTO recipes_tags (recipe_id, tag_id) VALUES ${placeholders};`;
        await conn.execute(insertQuery, tagListTo);
    }
    catch (e) {
        console.error("newRecipe: ", e);
        await conn.rollback();
        throw e;
    }
    finally{
        conn.release();
    }
};

const getById = async (id) => {
    const [recipe] = await db.execute(
        'SELECT * FROM recipes WHERE id = ?;',
        [id]
    );
    if (recipe.length === 0) {
        throw new NotFoundError(`recipe not found (id: ${id})`);
    }
    return recipe[0];
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

const getRandom = async () => {
    const [recipe] = await db.execute(
        'SELECT name, id, image FROM highball_maniac.recipes ORDER BY RAND() DESC LIMIT 4;');
    return recipe;
};

export default {
    newRecipe,
    addTag,
    deleteTag,
    setTags,
    getById,
    getTags,
    getItems, 
    getIngredients, 
    searchRecipeByName,
    searchByIngredient,
    getByUserId,
    getNewest,
    getRandom
}