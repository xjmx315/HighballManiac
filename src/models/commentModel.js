//commentModel.js

import db from './db.js';

const newComment = async (recipeId, content, userId) => {
    const result = await db.execute(
        'INSERT INTO comments (recipe_id, user_id, content, created_at) VALUES (?, ?, ?, NOW())',
        [recipeId, userId, content]
    );
    return result;
};

const deleteComment = async (commentId) => {
    const result = await db.execute(
        'DELETE FROM comments WHERE id = ?',
        [commentId]
    );
    return result;
};

const getById = async (commentId) => {
    const [result] = await db.execute(
        'SELECT * FROM comments WHERE id = ?',
        [commentId]
    );
    return result;
};

const getByRecipeId = async (recipeId) => {
    const [result] = await db.execute(
        'SELECT * FROM comments WHERE recipe_id = ?',
        [recipeId]
    );
    return result;
};

export default {
    newComment, 
    deleteComment,
    getById,
    getByRecipeId
};