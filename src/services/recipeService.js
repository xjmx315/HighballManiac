//recipeService.js

import recipeModel from "../models/recipeModel.js";
import tagModel from "../models/tagModel.js";
import { ConflictError, NotFoundError, ForbiddenError, UnauthorizedError } from "../errors/CommonError.js";

const _joinItemIngre = (items, ingrs) => {
    //item의 id에 +100을 해서 병합
    const tmp = ingrs.map(value => { return {...value, id: value.id+100} });
    return [...items, ...tmp];
};

const _splitItemIngre = (ids) => {
    //ids"1,102,104" => item[1] ingredient[2, 4]
    const items = [];
    const ingredients = [];

    ids.split(',').map(Number).forEach(element => {
        if (element > 100) {
            ingredients.push(element -100);
        }
        else {
            items.push(element);
        }
    });

    return {items, ingredients};
};

const _canUserUpdateRecipe = async (recipeId, requestUser) => {
    //1. 존재하는 레시피
    const recipe = await recipeModel.getById(recipeId);
    //2. 수정 권한이 있는 레시피
    if (recipe.user_id !== requestUser) {
        throw new ForbiddenError("레시피를 수정할 권한이 없습니다. ");
    }
    return true;
};

const newRecipe = async (recipe) => {
    if (!recipe.image) {
        recipe.image = '';
    }
    try {
        const insertId = await recipeModel.newRecipe(recipe);
        return insertId;
    }
    catch (e) {
        if (e.message.startsWith("Duplicate entry")) {
            throw new ConflictError("이미 같은 이름의 레시피가 있습니다. ");
        }
        throw e;
    }
};

const addTag = async (recipeId, tagId, requestUser) => {
    _canUserUpdateRecipe(recipeId, requestUser);
    await tagModel.getById(tagId);

    return await recipeModel.addTag(recipeId, tagId);
};

const deleteTag = async (recipeId, tagId, requestUser) => {
    _canUserUpdateRecipe(recipeId, requestUser);
    return await recipeModel.deleteTag(recipeId, tagId);
};

const setTags = async (recipeId, tagListTo, requestUser) => {
    _canUserUpdateRecipe(recipeId, requestUser);
    //데이터 크기가 작으니 일괄 삭제, 삽입
    return await recipeModel.setTags(recipeId, tagListTo);
};

const getById = async (id) => {
    const result = await recipeModel.getById(id);
    return result;
};

const getTags = async (id) => {
    const result = await recipeModel.getTags(id);
    return result;
};

const getItems = async (id) => {
    const result = await recipeModel.getItems(id);
    if (result.length === 0) {
        return undefined;
    }
    return result;
};

const getIngredients = async (id) => {
    const result = await recipeModel.getIngredients(id);
    if (result.length === 0) {
        return undefined;
    }
    return result;
};

const getItemsAndIngredients = async (id) => {
    const items = await recipeModel.getItems(id);
    const ingredients = await recipeModel.getIngredients(id);

    //ingredients에 +100 하여 병합
    const result = _joinItemIngre(items, ingredients);
    return result;
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

const searchByIngredient = async (ids) => {
    //ids"1,102,104" => item[1] ingredient[2, 4]
    const {items, ingredients} = _splitItemIngre(ids);
    const recipes = await recipeModel.searchByIngredient(items, ingredients);
    return recipes;
};

const getByUserId = async (id) => {
        const recipes = await recipeModel.getByUserId(id);
        return recipes;
};

const getPopualer = async () => {

};

const getNewest = async () => {
    const recipes = await recipeModel.getNewest();
    return recipes;
};

const getRandom = async () => {
    const recipes = await recipeModel.getRandom();
    return recipes;
};  

export default {
    newRecipe,
    addTag,
    deleteTag,
    setTags,
    getById,
    getTags,
    getItems,
    getIngredients,
    getItemsAndIngredients,
    getByUserId,
    searchRecipeByName,
    searchByIngredient,
    getPopualer,
    getNewest,
    getRandom,
};