//adminController.js

import usersService from "../services/usersService.js";
import seedManager from "../models/seedManager.js";
import CommonResponse from "../prototype/commonResponse.js";

const initDB = async (req, res) => {
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

export default {initDB: initDB};