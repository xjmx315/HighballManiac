//itemService.js

//import getItems from '../controllers/itemController';
import itemModel from '../models/itemModel.js';

const getItems = async () => {
    return await itemModel.getItems();
};

const searchItemByName = async (searchTerm) => {
    return await itemModel.searchItemByName(searchTerm);
};

export default {
    getItems,
    searchItemByName
};