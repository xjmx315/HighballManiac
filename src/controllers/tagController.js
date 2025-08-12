//tagController.js

import CommonResponse from "../prototype/commonResponse.js";
import tagService from "../services/tagService.js";

const searchTags = async (req, res) => {
    const searchTerm = req.query.name;
    if (!searchTerm) {
        return res.status(400).json(new CommonResponse(false, 400, "쿼리가 누락되었습니다. "));
    }

    const result = await tagService.searchTags(searchTerm);
    return res.status(200).json(new CommonResponse().setData(result));
};

const getById = async (req, res) => {
    const tagId = Number(req.params.id);
    if (isNaN(tagId)) {
        return res.status(400).json(new CommonResponse(false, 400, "쿼리 형식이 잘못되었습니다. "));
    }

    const tagData = await tagService.getById(tagId);
    if (!tagData) {
        return res.status(404).json(new CommonResponse(false, 404, '존재하지 않는 id 입니다. '));
    }

    return res.status(200).json(new CommonResponse().setData(tagData));
};

const getRecipes = async (req, res) => {
    const tagId = Number(req.params.id);
    if (isNaN(tagId)) {
        return res.status(400).json(new CommonResponse(false, 400, "쿼리 형식이 잘못되었습니다. "));
    }

    const tagData = await tagService.getById(tagId);
    if (!tagData) {
        return res.status(404).json(new CommonResponse(false, 404, '존재하지 않는 id 입니다. '));
    }

    const recipes = await tagService.getRecipes(tagId);

    return res.status(200).json(new CommonResponse().setData(recipes));
};

export default {
    searchTags,
    getById,
    getRecipes
};