//tagController.js

import CommonResponse from "../prototype/commonResponse.js";
import tagService from "../services/tagService.js";
import asyncHandler from "./asyncHandler.js";

const searchTags = asyncHandler(async (req, res) => {
    const searchTerm = req.query.name;
    const result = await tagService.searchTags(searchTerm);
    return res.status(200).json(new CommonResponse().setData(result));
});

const getById = asyncHandler(async (req, res) => {
    const tagId = Number(req.params.id);
    const tagData = await tagService.getById(tagId);
    return res.status(200).json(new CommonResponse().setData(tagData));
});

const getRecipes = asyncHandler(async (req, res) => {
    const tagId = Number(req.params.id);
    const recipes = await tagService.getRecipes(tagId);
    return res.status(200).json(new CommonResponse().setData(recipes));
});

const getAllTags = asyncHandler(async (req, res) => {
    const tags = await tagService.getAllTags();
    return res.status(200).json(new CommonResponse().setData(tags));
});

export default {
    searchTags,
    getById,
    getRecipes,
    getAllTags
};