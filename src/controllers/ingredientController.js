//ingredientController.js

import ingredientService from '../services/ingredientService.js';
import CommonResponse from '../prototype/commonResponse.js';

const searchIngredientByName = async (req, res) => {
    try {
        const searchTerm = req.query.name;
        if (!searchTerm){
            return res.status(400).json(new CommonResponse(false, 400, "검색어가 없습니다. "));
        }
        const result = await ingredientService.searchIngredientByName(searchTerm);
        res.status(200).json(new CommonResponse().setData(result));
    }
    catch (error){
        res.status(500).json(new CommonResponse(false, 500, error.message));
    }
};

const getById = async (req, res) => {
    try {
        const id = req.query.id;
        if (!id){
            return res.status(400).json(new CommonResponse(false, 400, "id가 없습니다"));
        }
        const result = await ingredientService.getById(id);
        res.status(200).json(new CommonResponse().setData(result));
    }
    catch (error){
        res.status(500).json(new CommonResponse(false, 500, error.message));
    }
};

export default {
    searchIngredientByName,
    getById
}