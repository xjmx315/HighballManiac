//itemController.js

import itemService from '../services/itemService.js';

const getItems = async (req, res) => {
    try {
        const items = await itemService.getItems();
        res.json(items);
    }
    catch (error){
        res.status(500).json({ message: error.message });
    }
};

const searchItemByName = async (req, res) => {
    try {
        const searchTerm = req.query.name;
        if (!searchTerm){
            return res.status(400).json({ error: '검색어가 없습니다. ' });
        }
        const result = await itemService.searchItemByName(searchTerm);
        res.json(result);
    }
    catch (error){
        res.status(500).json({ message: error.message });
    }
};

export default { 
    getItems: getItems,
    searchItemByName: searchItemByName
};