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

export default { getItems: getItems };