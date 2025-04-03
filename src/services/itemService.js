//itemService.js

//import getItems from '../controllers/itemController';
import Item from '../models/itemModel.js';

const getItems = async () => {
    return await Item.getItems();
};

const searchItemByName = async (searchTerm) => {
    return await Item.searchItemByName(searchTerm);
};

export default {
    getItems: getItems,
    searchItemByName: searchItemByName
};