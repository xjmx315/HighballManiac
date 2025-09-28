//itemController.js

import itemService from '../services/itemService.js';
import CommonResponse from '../prototype/commonResponse.js';
import asyncHandler from './asyncHandler.js';

const getItems = asyncHandler(async (req, res) => {
    const items = await itemService.getItems();
    res.status(200).json(new CommonResponse().setData(items));
});

const searchItemByName = asyncHandler(async (req, res) => {
    const searchTerm = req.query.name;
    const result = await itemService.searchItemByName(searchTerm);
    res.status(200).json(new CommonResponse().setData(result));
});

export default { 
    getItems,
    searchItemByName
};