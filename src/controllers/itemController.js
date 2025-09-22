//itemController.js

import itemService from '../services/itemService.js';
import CommonResponse from '../prototype/commonResponse.js';
import { ServiceError, CommonError } from '../errors/CommonError.js';

const getItems = async (req, res) => {
    try {
        const items = await itemService.getItems();
        res.status(200).json(new CommonResponse().setData(items));
    }
    catch (error){
        if (error instanceof CommonError) {
            return next(error);
        }
        return next(new ServiceError('searchItemByName is Not Working', error));
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
        if (error instanceof CommonError) {
            return next(error);
        }
        return next(new ServiceError('searchItemByName is Not Working', error));
    }
};

export default { 
    getItems,
    searchItemByName
};