//commentModel.js

import {getPool} from './db.js';
import { NotFoundError } from '../errors/CommonError.js';

const db = getPool();

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
    if (result.length === 0){
        throw new NotFoundError(`comment not found (id: ${commentId})`);
    }
    return result[0];
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