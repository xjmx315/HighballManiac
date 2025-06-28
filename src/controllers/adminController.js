//adminController.js

import usersService from "../services/usersService.js";
import seedManager from "../models/seedManager.js";
import CommonResponse from "../prototype/commonResponse.js";

const _deleteData = async (tableName) => {
    //테이블에 있는 모든 데이터를 지운다. 
    
};

const _updateCsvToTable = async (tableName, filePath) => {
    //csv파일에 있는 데이터를 테이블에 추가한다. 기존 데이터는 유지된다. 
};

const _exportTabletoCsv = async (tableName, filePath) => {
    //테이블에 있는 데이터를 csv 파일로 추출한다. 
};

const initDB = async (req, res) => {
    //테이블을 모두 DROP하고 처음부터 다시 만든다. 스키마 구조 변경시 사용. 
    console.log(req.body);
    const {adminPassword} = req.body;
    if (!adminPassword) {
        return res.status(401).json(new CommonResponse(false, 401, "관리자 비밀번호를 포함해야 합니다. "));
    }

    const adminCheck = await usersService.login(adminPassword, "admin");

    if (!adminCheck) {
        return res.status(401).json(new CommonResponse(false, 401, "비밀번호가 올바르지 않습니다. "));
    } 

    try{
        await seedManager.initDB();
    }
    catch (e) {
        console.log("error: DB초기화 실패 - ", e);
        return res.status(500).json(new CommonResponse(false, 500, "DB 초기화 실패", {detail: e.message}));
    }

    return res.status(200).json(new CommonResponse());
};

const updateItems = async (req, res) => {

};

const exportItems = async (req, res) => {
    
};

export default {
    initDB,
    updateItems,
    exportItems
};