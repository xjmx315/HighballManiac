//recipeController.js
import recipeService from '../services/recipeService.js';
import CommonResponse from '../prototype/commonResponse.js';


const newRecipe = async (req, res) => {
    //body 필수 항목 검사
    const requiredField = ['name', 'discription', 'recipe', 'alcohol', 'ingredients', 'items'];
    for (const key of requiredField) {
        if (!(key in req.body)) {
            return res.status(400).json(new CommonResponse(false, 400, `필드 '${key}'이(가) 누락되었습니다. `));
        }
    };

    //service 호출
    const serviceResult = await recipeService.newRecipe({ userId: req.userInfo.id , ...req.body });
    if (!serviceResult.ok) {
        return res.status(400).json(new CommonResponse(false, 400, serviceResult.message));
    }

    res.status(201).json(new CommonResponse().setCode(201).setData({ id: serviceResult.id }));
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