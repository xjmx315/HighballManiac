//commentService.js

import commentModel from "../models/commentModel.js";

const newComment = async (recipeId, content, userId) => {
    return await commentModel.newComment(recipeId, content, userId);
};

const deleteComment = async (commentId) => {
    return await commentModel.deleteComment(commentId);
};

const getById = async (commentId) => {
    return await commentModel.getById(commentId);
};

const getByRecipeId = async (recipeId) => {
    return await commentModel.getByRecipeId(recipeId);
};

export default {
    newComment, 
    deleteComment,
    getById,
    getByRecipeId
};