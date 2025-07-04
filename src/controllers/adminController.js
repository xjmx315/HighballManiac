//adminController.js

import usersService from "../services/usersService.js";
import seedManager from "../models/seedManager.js";
import CommonResponse from "../prototype/commonResponse.js";
import path from "path";

import dotenv from "dotenv";
dotenv.config();

const csvSeedPath = process.env.CSVPATH || 'csvFiles/';

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
    seedManager._updateTablefromCsv("Items", csvSeedPath);

    return res.status(200).json(new CommonResponse());
};

const exportItems = async (req, res) => {
    const filePath = await seedManager._exportTabletoCsv("Items", csvSeedPath);

    if (filePath){
        return res
            .type('text/csv')
            .download(path.join(csvSeedPath, filePath));
    }
    else {
        return res
            .status(500)
            .json(new CommonResponse(false, 500, 'csv파일 내보내기에 실패했습니다. '));
    }
};

const updateIngredients = async (req, res) => {
    if (!req.file) {
        return res.status(400).json(new CommonResponse(false, 400, "파일이 없습니다. "));
    }

    //TODO:파일 인코딩 utf-8로 확인
    const succeed = await seedManager._updateTablefromCsv("Ingredients", req.file.path);

    if (succeed === 0) {
        return res.status(200).json(new CommonResponse());
    }
    else {
        return res.status(500).json(new CommonResponse(false, 500, "csv파일 업데이트에 실패했습니다. "));
    }
};

const exportIngredients = async (req, res) => {
    const filePath = await seedManager._exportTabletoCsv("Ingredients", csvSeedPath);
    if (filePath === -1) {
        return res
            .status(406)
            .json(new CommonResponse(false, 406, "테이블이 비어있습니다. "));
    }

    if (filePath){
        return res
            .type('text/csv')
            .download(path.join(csvSeedPath, filePath));
    }
    else {
        return res
            .status(500)
            .json(new CommonResponse(false, 500, 'csv파일 내보내기에 실패했습니다. '));
    }
};

const deleteIngredients = async (req, res) => {
    const succeed = seedManager._deleteData('Ingredients');
    if (succeed) {
        res.status(200).json(new CommonResponse());
    }
    else {
        res.status(500).json(new CommonResponse(false, 500, '테이블 삭제에 실패했습니다. '))
    }
};

export default {
    initDB,
    updateItems,
    exportItems,
    updateIngredients,
    exportIngredients,
    deleteIngredients,
    csvSeedPath
};