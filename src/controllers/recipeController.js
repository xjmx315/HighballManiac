//recipeController.js
import recipeService from '../services/recipeService.js';


const newRecipe = (req, res) => {
    //body 필수 항목 검사
    const requiredField = ['name', 'discription', 'recipe', 'alcohol'];
    const recipe = recipeService.newRecipe(req.body);
    if (!recipe) {
        return res.status(400).json({message: "레시피 생성에 실패했습니다. "});
    }
    res.status(201).json(recipe);
};

const getPopualer = (req, res) => {

};

const getNewest = (req, res) => {

};

const getRandom = (req, res) => {

};

const getById = (req, res) => {

};

const searchRecipeByName = (req, res) => {

};

const getRecipeByCategory = (req, res) => {

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