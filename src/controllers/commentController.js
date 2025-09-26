//commentController.js

import commentService from "../services/commentService.js";
import CommonResponse from "../prototype/commonResponse.js";
import asyncHandler from "./asyncHandler.js";

const newComment = asyncHandler(async (req, res) => {
    const {recipeId, content} = req.body;
    const userId = req.userInfo.userId;
    const comment = await commentService.newComment(recipeId, content, userId);
    return res.status(201).json(new CommonResponse());
});

const deleteComment = asyncHandler(async (req, res) => {
    const {commentId} = req.body;
    const userId = req.userInfo.userId;
    commentService.deleteComment(commentId, userId);
    return res.status(200).json(new CommonResponse());
});

const getById = asyncHandler(async (req, res) => {
    const {id} = req.params;
    const comment = await commentService.getById(id);
    return res.status(200).json(new CommonResponse().setData(comment));
});

const getByRecipeId = asyncHandler(async (req, res) => {
    const {id} = req.params;
    const comment = await commentService.getByRecipeId(id);
    return res.status(200).json(new CommonResponse().setData(comment));
});

export default {
    newComment, 
    deleteComment,
    getById,
    getByRecipeId
};