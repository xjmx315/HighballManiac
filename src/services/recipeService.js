//recipeService.js

import recipeModel from "../models/recipeModel.js";

const newRecipe = async ({ name, discription, recipe, alcohol, ingredients, items, userId }) => {
    const result = await recipeModel.newRecipe({name, discription, recipe, alcohol, ingredients, items, userId});
    console.log(result);
    return result;
};

const getPopualer = () => {

};

const getNewest = () => {

};  

const getRandom = () => {

};  

const getById = () => {

};  

const searchRecipeByName = () => {
    

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