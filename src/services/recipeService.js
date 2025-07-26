//recipeService.js

import recipeModel from "../models/recipeModel.js";

const newRecipe = async (recipe) => {
    if (!recipe.image) {
        recipe.image = '';
    }
    try {
        const result = await recipeModel.newRecipe(recipe);
        return {ok: true, id: result.insertId};
    }
    catch (e) {
        if (e.message.startsWith('Duplicate entry')) {
            return { ok: false, message: '이미 같은 이름의 레시피가 있습니다. '};
        }
        return { ok: false, message: `지정되지 않은 에러가 발생했습니다. : ${e.message}`};
    }
};

const getById = async (id) => {
    try {
        const result = await recipeModel.getById(id);
        if (result.length === 0){
            return undefined;
        }
        return result[0];
    }
    catch (e) {
        console.log(e);
        return undefined;
    }
};  

const searchRecipeByName = async (name) => {
    try {
        const result = await recipeModel.searchRecipeByName(name);
        return result;
    }
    catch (e) {
        console.log(e);
        return undefined;
    }
};


const getPopualer = async () => {

};

const getNewest = async () => {

};  

const getRandom = async () => {

};  

const getRecipeByCategory = async () => {

};  


export default {
    newRecipe: newRecipe,
    getPopualer: getPopualer,
    getNewest: getNewest,
    getRandom: getRandom,
    getById: getById,
    searchRecipeByName: searchRecipeByName,
    getRecipeByCategory: getRecipeByCategory
};