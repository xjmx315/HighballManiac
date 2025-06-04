//itemController.js

import itemService from '../services/itemService.js';
import CommonResponse from '../prototype/commonResponse.js';

const getItems = async (req, res) => {
    try {
        const items = await itemService.getItems();
        res.json(new CommonResponse().setData(items));
    }
    catch (error){
        res.status(500).json(new CommonResponse(false, 500, error.message));
    }
};

const searchItemByName = async (req, res) => {
    try {
        const searchTerm = req.query.name;
        if (!searchTerm){
            return res.status(400).json(new CommonResponse(false, 400, "검색어가 없습니다. "));
        }
        const result = await itemService.searchItemByName(searchTerm);
        res.status(200).json(new CommonResponse().setData(result));
    }
    catch (error){
        res.status(500).json(new CommonResponse(false, 500, error.message));
    }
};

export default { 
    getItems: getItems,
    searchItemByName: searchItemByName
};