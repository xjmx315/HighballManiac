//tagService.js

import tagModel from "../models/tagModel.js";

const searchTags = async (searchTerm) => {
    const result = await tagModel.searchTags(searchTerm);
    return result;
};

const getById = async (id) => {
        const result = await tagModel.getById(id);
        return result;
};

const getRecipes = async (id) => {
    //태그가 존재하는지 확인
    await tagModel.getById(id);
    //레시피 검색
    const result = await tagModel.getRecipes(id);
    return result;
};

const getAllTags = async () => {
    const result = await tagModel.getAllTags();
    return result;
};

export default {
    searchTags,
    getById,
    getRecipes,
    getAllTags
};