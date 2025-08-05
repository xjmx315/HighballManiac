//tagService.js

import tagModel from "../models/tagModel.js";

const searchTags = async (searchTerm) => {
    try {
        const result = await tagModel.searchTags(searchTerm);
        return result;
    }
    catch (e) {
        console.log(e);
        return [];
    }
}

export default {
    searchTags
};