//validateTable.js

import CommonResponse from "../prototype/commonResponse";

const validateTable = (req, res, next) => {
    const acceptableTableList = [
        'ingredients', 
        'items', 
        'users', 
        'recipes', 
        'comments', 
        'tags', 
        'recipes_tages', 
        'recipes_items',
        'recipes_ingredients',
        'items_ingredients'
    ]
    const {tableName} = req.params;
    if (!tableName) {
        return res.status(404).json(new CommonResponse(false, 404, '테이블 이름을 포함해야 합니다. '));
    }
    if (!acceptableTableList.includes(tableName)){
        return res.status(400).json(new CommonResponse(false, 400, '유효하지 않은 테이블 이름입니다. '));
    }
    next();
};

export default validateTable;