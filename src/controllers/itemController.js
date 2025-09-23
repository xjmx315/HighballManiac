//itemController.js

import itemService from '../services/itemService.js';
import CommonResponse from '../prototype/commonResponse.js';
import { CommonError } from '../errors/CommonError.js';
import asyncHandler from './asyncHandler.js';

const getItems = asyncHandler(async (req, res) => {
    const items = await itemService.getItems();
    res.status(200).json(new CommonResponse().setData(items));
});

const searchItemByName = asyncHandler(async (req, res) => {
    const searchTerm = req.query.name;
    if (!searchTerm){
        return res.status(400).json(new CommonResponse(false, 400, "검색어가 없습니다. "));
    }
    const result = await itemService.searchItemByName(searchTerm);
    res.status(200).json(new CommonResponse().setData(result));
});

export default { 
    getItems,
    searchItemByName
};