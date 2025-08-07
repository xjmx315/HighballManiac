//recipeController.js
import recipeService from '../services/recipeService.js';
import CommonResponse from '../prototype/commonResponse.js';
import tagService from '../services/tagService.js';


const newRecipe = async (req, res) => {
    //body 필수 항목 검사
    const requiredField = ['name', 'description', 'recipe', 'alcohol', 'ingredients', 'items'];
    for (const key of requiredField) {
        if (!(key in req.body)) {
            return res.status(400).json(new CommonResponse(false, 400, `필드 '${key}'이(가) 누락되었습니다. `));
        }
    };

    //service 호출
    const serviceResult = await recipeService.newRecipe({ userId: req.userInfo.userId , ...req.body });
    if (!serviceResult.ok) {
        return res.status(400).json(new CommonResponse(false, 400, serviceResult.message));
    }

    res.status(201).json(new CommonResponse().setCode(201).setData({ id: serviceResult.id }));
};

const addTag = async (req, res) => {
    const {recipeId, tagId} = req.body;

    //레시피 유효성 검사
    const recipeData = await recipeService.getById(recipeId);
    if (!recipeData) {
        return res.status(404).json(new CommonResponse(false, 404, '존재하지 않는 레시피 입니다. '));
    }
    if (recipeData.user_id !== req.userInfo.userId) {
        return res.status(403).json(new CommonResponse(false, 403, '자신이 업로드한 레시피만 수정할 수 있습니다. '));
    }

    //태그 유효성 검사
    if (!await tagService.getById(tagId)) {
        return res.status(404).json(new CommonResponse(false, 404, '존재하지 않는 태그입니다. '));
    }

    try {
        await recipeService.addTag(recipeId, tagId);
        return res.status(200).json(new CommonResponse());
    }
    catch (e) {
        return res.status(500).json(new CommonResponse(false, 500, '예기치 못한 에러가 발생했습니다. ', e.message));
    }
};

const getById = async (req, res) => {
    const id = req.params.id;
    if (!id) {
        return res.status(400).json(new CommonResponse(false, 400, 'id를 포함해야 합니다. '));
    }
    
    const result = await recipeService.getById(id);
    if (!result) {
        return res.status(404).json(new CommonResponse(false, 404, '존재하지 않는 id 입니다. '));
    }
    return res.status(200).json(new CommonResponse().setData(result));
};

const getTags = async (req, res) => {
    const id = req.params.id;
    if (!id) {
        return res.status(400).json(new CommonResponse(false, 400, 'id를 포함해야 합니다. '));
    }
    
    const result = await recipeService.getTags(id);
    if (!result) {
        return res.status(404).json(new CommonResponse(false, 404, 'id 또는 등록된 태그가 없습니다. '));
    }
    return res.status(200).json(new CommonResponse().setData(result));
};

const getPopualer = (req, res) => {

};

const getNewest = (req, res) => {

};

const getRandom = (req, res) => {

};

const searchRecipeByName = (req, res) => {

};

const getRecipeByCategory = (req, res) => {

};


export default {
    newRecipe,
    addTag,
    getById,
    getTags,
    getPopualer,
    getNewest,
    getRandom,
    searchRecipeByName,
    getRecipeByCategory,
};