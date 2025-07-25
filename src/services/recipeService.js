//recipeService.js

import recipeModel from "../models/recipeModel.js";

const newRecipe = async (recipe) => {
    console.log(recipe);
    if (!recipe.image) {
        recipe.image = '';
    }
    try {
        const [result] = await recipeModel.newRecipe(recipe);
        return {ok: true, id: result.id};
    }
    catch (e) {
        if (e.message === 'name column must be unique') {
            return { ok: false, message: '이미 같은 이름의 레시피가 있습니다. '};
        }
        return { ok: false, message: `지정되지 않은 에러가 발생했습니다. : ${e.message}`};
    }
};

const searchRecipeByName = async (name) => {
    const result = await recipeModel.searchRecipeByName(name);


};


const getPopualer = () => {

};

const getNewest = () => {

};  

const getRandom = () => {

};  

const getById = () => {

};  

const getRecipeByCategory = () => {

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