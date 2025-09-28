//recipeController.js
import recipeService from '../services/recipeService.js';
import CommonResponse from '../prototype/commonResponse.js';
import tagService from '../services/tagService.js';
import asyncHandler from './asyncHandler.js';

const newRecipe = asyncHandler(async (req, res) => {
    const insertId = await recipeService.newRecipe({ userId: req.userInfo.userId , ...req.body });
    res.status(201).json(new CommonResponse().setCode(201).setData({ id: insertId }));
});

const addTag = asyncHandler(async (req, res) => {
    const {recipeId, tagId} = req.body;
    const userId = req.userInfo.userId;
    await recipeService.addTag(recipeId, tagId, userId);
    return res.status(201).json(new CommonResponse().setCode(201));
});

const deleteTag = asyncHandler(async (req, res) => {
    const {recipeId, tagId} = req.body;
    const userId = req.userInfo.userId;
    await recipeService.deleteTag(recipeId, tagId, userId);
    return res.status(200).json(new CommonResponse());
});

const setTags = asyncHandler(async (req, res) => {
    const {recipeId, tagList} = req.body;
    const userId = req.userInfo.userId;
    await recipeService.setTags(recipeId, tagList, userId);
    return res.status(200).json(new CommonResponse());
});

const getById = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const result = await recipeService.getById(id);
    const tags = await recipeService.getTags(id);
    result.tags = tags;
    return res.status(200).json(new CommonResponse().setData(result));
});

const getTags = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const result = await recipeService.getTags(id);
    return res.status(200).json(new CommonResponse().setData(result));
});

const getItemsAndIngredients = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const result = await recipeService.getItemsAndIngredients(id, recipeService.getItems, recipeService.getIngredients);
    return res.status(200).json(new CommonResponse().setData(result));
});

const getNewest = asyncHandler(async (req, res) => {
    const result = await recipeService.getNewest();
    return res.status(200).json(new CommonResponse().setData(result));
});

const getRandom = asyncHandler(async (req, res) => {
    const result = await recipeService.getRandom();
    return res.status(200).json(new CommonResponse().setData(result));
});

const searchRecipeByName = (req, res) => {
};

const searchByIngredient = asyncHandler(async (req, res) => {
    //"1,102,104" => item[1] ingredient[2, 4]
    const {items} = req.query; 
    const result = await recipeService.searchByIngredient(items);
    return res.status(200).json(new CommonResponse().setData(result));
});

const getByUserId = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const result = await recipeService.getByUserId(id);
    return res.status(200).json(new CommonResponse().setData(result));
});

export default {
    newRecipe,
    addTag,
    deleteTag,
    setTags,
    getById,
    getTags,
    getItemsAndIngredients,
    getNewest,
    getRandom,
    searchRecipeByName,
    searchByIngredient,
    getByUserId
};