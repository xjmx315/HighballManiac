//tagController.js

import CommonResponse from "../prototype/commonResponse";
import tagService from "../services/tagService";

const searchTags = async (req, res) => {
    const searchTerm = req.query.name;
    if (!searchTerm) {
        return res.status(400).json(new CommonResponse(false, 400, "쿼리가 누락되었습니다. "));
    }

    const result = await tagService.searchTags(searchTerm);
    return res.status(200).json(new CommonResponse().setData(result));
};

export default {
    searchTags
};