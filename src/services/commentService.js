//commentService.js

import commentModel from "../models/commentModel.js";
import { UnauthorizedError } from "../errors/CommonError.js";

const newComment = async (recipeId, content, userId) => {
    return await commentModel.newComment(recipeId, content, userId);
};

const deleteComment = async (commentId, requestUser) => {
    //유저 검증
    const comment = await commentModel.getById(commentId);
    const commentWriter = comment.user_id;
    if (commentWriter === requestUser) {
        await commentModel.deleteComment(commentId);
        return true;
    }
    throw new UnauthorizedError("댓글을 삭제할 권한이 없습니다. ");
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