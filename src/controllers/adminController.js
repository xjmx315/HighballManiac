//adminController.js

import usersService from "../services/usersService.js";
import seedManager from "../models/seedManager.js";
import multer from "multer";
import CommonResponse from "../prototype/commonResponse.js";
import dotenv from "dotenv";

dotenv.config();

const csvSeedPath = process.env.CSVPATH || 'csvFiles/'
const upload = multer({ dest: csvSeedPath })

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
    seedManager._exportTabletoCsv("Items", csvSeedPath);

    return res.status(200).json(new CommonResponse());
};

const updateIngredients = async (req, res) => {

};

const exportIngredients = async (req, res) => {
    seedManager._exportTabletoCsv("Ingredients", csvSeedPath);

    return res.status(200).json(new CommonResponse());
};

export default {
    initDB,
    updateItems,
    exportItems,
    updateIngredients,
    exportIngredients
};