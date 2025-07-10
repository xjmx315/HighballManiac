//ingredientService.js

import ingredientModel from "../models/ingredientModel.js";

const searchIngredientByName = async (searchTerm) => {
    return await ingredientModel.searchIngredientByName(searchTerm);
}

export default {
    searchIngredientByName
}