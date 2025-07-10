//ingredientService.js

import ingredientModel from "../models/ingredientModel.js";

const searchIngredientByName = async (searchTerm) => {
    return await ingredientModel.searchIngredientByName(searchTerm);
};

const getById = async (id) => {
    return await ingredientModel.getById(id);
};

export default {
    searchIngredientByName,
    getById
}