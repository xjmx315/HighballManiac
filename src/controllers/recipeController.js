//recipeController.js
import recipeService from '../services/recipeService.js';
import CommonResponse from '../prototype/commonResponse.js';
import tagService from '../services/tagService.js';


const newRecipe = async (req, res) => {
    //body 필수 항목 검사
    const requiredField = ['name', 'description', 'recipe', 'alcohol', 'ingredients', 'items', 'tags'];
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

const deleteTag = async (req, res) => {
    const {recipeId, tagId} = req.body;

    //레시피 유효성 검사
    const recipeData = await recipeService.getById(recipeId);
    if (!recipeData) {
        return res.status(404).json(new CommonResponse(false, 404, '존재하지 않는 레시피 입니다. '));
    }
    if (recipeData.user_id !== req.userInfo.userId) {
        return res.status(403).json(new CommonResponse(false, 403, '자신이 업로드한 레시피만 수정할 수 있습니다. '));
    }

    //태그 존재 확인
    const tags = await recipeService.getTags(recipeId);
    if (!tags || !tags.some(v => v.id === tagId)) {
        return res.status(200).json(new CommonResponse());
    }

    try {
        await recipeService.deleteTag(recipeId, tagId);
        return res.status(200).json(new CommonResponse());
    }
    catch (e) {
        return res.status(500).json(new CommonResponse(false, 500, '예기치 못한 에러가 발생했습니다. ', e.message));
    }
};

const setTags = async (req, res) => {
    const {recipeId, tagList} = req.body;
    console.log(req.body);

    //레시피 유효성 검사
    const recipeData = await recipeService.getById(recipeId);
    if (!recipeData) {
        return res.status(404).json(new CommonResponse(false, 404, '존재하지 않는 레시피 입니다. '));
    }
    if (recipeData.user_id !== req.userInfo.userId) {
        return res.status(403).json(new CommonResponse(false, 403, '자신이 업로드한 레시피만 수정할 수 있습니다. '));
    }
    const recipeTags = await recipeService.getTags(recipeId);

    //recipe service 호출
    const failed = await recipeService.setTags(recipeService.addTag, recipeService.deleteTag, recipeId, recipeTags, tagList);
    
    if (failed.length === 0) {
        return res.status(200).json(new CommonResponse());
    }
    return res.status(200).json(new CommonResponse().setMessage('일부 태그 삽입에 실패했습니다. ').setData(failed));
};

const getById = async (req, res) => {
    const id = req.params.id;
    if (!id) {
        return res.status(400).json(new CommonResponse(false, 400, 'id를 포함해야 합니다. '));
    }
    
    //레시피 정보 받아오기
    const result = await recipeService.getById(id);
    if (!result) {
        return res.status(404).json(new CommonResponse(false, 404, '존재하지 않는 id 입니다. '));
    }

    //tags 필드 추가
    const tags = await recipeService.getTags(id);
    //tag가 없으면 undifined가 리턴되기 때문에
    if (!tags) {
        result.tags = [];
    }
    else {
        result.tags = tags;
    }

    return res.status(200).json(new CommonResponse().setData(result));
};

const getTags = async (req, res) => {
    const id = req.params.id;
    
    const result = await recipeService.getTags(id);
    if (!result) {
        return res.status(404).json(new CommonResponse(false, 404, 'id 또는 등록된 태그가 없습니다. '));
    }
    return res.status(200).json(new CommonResponse().setData(result));
};

const getItemsAndIngredients = async (req, res) => {
    const id = req.params.id;

    const result = await recipeService.getItemsAndIngredients(id, recipeService.getItems, recipeService.getIngredients);
    if (!result) {
        return res.status(404).json(new CommonResponse(false, 404, 'id 또는 등록된 태그가 없습니다. '));
    }
    return res.status(200).json(new CommonResponse().setData(result));
};

const getPopuler = (req, res) => {
    return res.status(500).json(new CommonResponse(false, 500, '아직 구현되지 않은 기능입니다. '));
};

const getNewest = async (req, res) => {
    const result = await recipeService.getNewest();
    if (result.err) {
        res.status(500).json(new CommonResponse(false, 500, result.err));
    }
    return res.status(200).json(new CommonResponse().setData(result));
};

const getRandom = async (req, res) => {
    const result = await recipeService.getRandom();
    if (result.err) {
        res.status(500).json(new CommonResponse(false, 500, result.err));
    }
    return res.status(200).json(new CommonResponse().setData(result));
};

const searchRecipeByName = (req, res) => {
    return res.status(500).json(new CommonResponse(false, 500, '아직 구현되지 않은 기능입니다. '));
};

const searchByIngredient = async (req, res) => {
    //"1,102,104" => item[1] ingredient[2, 4]
    const {items} = req.query; 
    
    const result = await recipeService.searchByIngredient(items);
    if (result.err) {
        res.status(500).json(new CommonResponse(false, 500, result.err));
    }
    return res.status(200).json(new CommonResponse().setData(result));
};

const getByUserId = async (req, res) => {
    const id = req.params.id;
    
    const result = await recipeService.getByUserId(id);
    if (result.err) {
        res.status(500).json(new CommonResponse(false, 500, result.err));
    }
    return res.status(200).json(new CommonResponse().setData(result));
};

export default {
    newRecipe,
    addTag,
    deleteTag,
    setTags,
    getById,
    getTags,
    getItemsAndIngredients,
    getPopuler,
    getNewest,
    getRandom,
    searchRecipeByName,
    searchByIngredient,
    getByUserId
};