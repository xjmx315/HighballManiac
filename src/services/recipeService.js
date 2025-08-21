//recipeService.js

import recipeModel from "../models/recipeModel.js";

const _itemPingr = (items, ingrs) => {
    //item의 id에 +100을 해서 병합
    const tmp = ingrs.map(value => { return {...value, id: value.id+100} });
    return [...items, ...tmp];
};

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

const addTag = async (recipeId, tagId) => {
    try {
        const result = await recipeModel.addTag(recipeId, tagId);
        return true;
    }
    catch (e) {
        console.error(e);
        return false;
    }
};

const deleteTag = async (recipeId, tagId) => {
    try {
        const result = await recipeModel.deleteTag(recipeId, tagId);
        return true;
    }
    catch (e) {
        console.error(e);
        return false;
    }
};

const setTags = async (addFunc, deleteFunc, recipeId, tagListFrom, tagListTo) => {
    const fromSet = new Set(tagListFrom);
    const toSet = new Set(tagListTo);

    const faileds = [];
    
    //from에는 있고 to에는 없는 요소는 delete
    const deleteProcess = tagListFrom.filter(item => !toSet.has(item)).map(item => deleteFunc(recipeId, item).then((result) => {if (!result) faileds.push(item)}));

    //to에는 있고 from에는 없는 요소는 add
    const addProcess = tagListTo.filter(item => !fromSet.has(item)).map(item => addFunc(recipeId, item).then((result) => {if (!result) faileds.push(item)}));

    try {
        await Promise.all(deleteProcess);
        await Promise.all(addProcess);
        return faileds;
    }
    catch (e) {
        console.error(e);
        return faileds;
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

const getTags = async (id) => {
    try {
        const result = await recipeModel.getTags(id);
        if (result.length === 0) {
            return undefined;
        }
        return result;
    }
    catch (e) {
        console.log(e);
        return undefined;
    }
};

const getItems = async (id) => {
    try {
        const result = await recipeModel.getItems(id);
        if (result.length === 0) {
            return undefined;
        }
        return result;
    }
    catch (e) {
        console.log(e);
        return undefined;
    }
};

const getIngredients = async (id) => {
    try {
        const result = await recipeModel.getIngredients(id);
        if (result.length === 0) {
            return undefined;
        }
        return result;
    }
    catch (e) {
        console.log(e);
        return undefined;
    }
};

const getItemsAndIngredients = async (id, itemFunc, ingredientFunc) => {
    try {
        const items = await itemFunc(id);
        const ingredients = await ingredientFunc(id);

        //ingredients에 +100 하여 병합
        const result = _itemPingr(items, ingredients);
        if (result.length === 0) {
            return undefined;
        }
        return result;
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
    newRecipe,
    addTag,
    deleteTag,
    setTags,
    getById,
    getTags,
    getItems,
    getIngredients,
    getItemsAndIngredients,
    getPopualer,
    getNewest,
    getRandom,
    searchRecipeByName,
    getRecipeByCategory
};