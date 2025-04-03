//itemService.js

//import getItems from '../controllers/itemController';
import Item from '../models/itemModel.js';

const getItems = async () => {
    return await Item.getItems();
};

export default {getItems: getItems};