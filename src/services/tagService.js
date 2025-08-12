//tagService.js

import tagModel from "../models/tagModel.js";

const searchTags = async (searchTerm) => {
    try {
        const result = await tagModel.searchTags(searchTerm);
        return result;
    }
    catch (e) {
        console.log(e);
        return [];
    }
};

const getById = async (id) => {
    try {
        const result = await tagModel.getById(id);
        if (result.length === 0) {
            return undefined;
        }
        return result[0];
    }
    catch (e) {
        console.error(e);
        return undefined;
    }
};

const getRecipes = async (id) => {
    try {
        const result = await tagModel.getRecipes(id);
        return result;
    }
    catch (e) {
        console.log(e);
        return [];
    }
};

export default {
    searchTags,
    getById,
    getRecipes
};