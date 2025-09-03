//commentController.js

import commentService from "../services/commentService.js";
import CommonResponse from "../prototype/commonResponse.js";

const newComment = async (req, res) => {
    const {recipeId, content} = req.body;
    const userId = req.userInfo.userId;
    const comment = await commentService.newComment(recipeId, content, userId);
    return res.status(201).json(new CommonResponse());
};

const deleteComment = async (req, res) => {
    const {commentId} = req.body;

    //user검증 후 삭제
    const targetComment = await commentService.getById(commentId);
    if (req.userInfo.userId === targetComment[0].user_id){
        await commentService.deleteComment(commentId);
        return res.status(200).json(new CommonResponse());
    }
    return res.status(400).json(new CommonResponse(false, 400, "댓글을 삭제할 권한이 없습니다. "))
};

const getById = async (req, res) => {
    const {id} = req.params;
    const comment = await commentService.getById(id);
    return res.status(200).json(new CommonResponse().setData(comment));
};

const getByRecipeId = async (req, res) => {
    const {id} = req.params;
    const comment = await commentService.getByRecipeId(id);
    return res.status(200).json(new CommonResponse().setData(comment));
};

export default {
    newComment, 
    deleteComment,
    getById,
    getByRecipeId
};