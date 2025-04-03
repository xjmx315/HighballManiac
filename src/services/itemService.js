//itemService.js

import Item from '../models/itemModel';

exports.getItems = async () => {
    return await Item.getItems();
};