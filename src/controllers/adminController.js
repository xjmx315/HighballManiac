//adminController.js

import usersService from "../services/usersService.js";
import seedManager from "../models/seedManager.js";

const initDB = async (req, res) => {
    const {adminPassword} = req.body;
    if (!adminPassword) {
        return res.status(401).json( { error: "관리자 비밀번호를 포함해야 합니다. "} );
    }

    const adminCheck = await usersService.login(adminPassword, "admin");

    if (!adminCheck) {
        return res.status(401).json( { error: "비밀번호가 올바르지 않습니다. " } );
    } 

    try{
        await seedManager.initDB();
    }
    catch (e) {
        console.log("error: DB초기화 실패 - ", e);
        throw e;
    }

    return res.status(200).json({ messge: "DB 초기화 완료" });
};

export default {initDB: initDB};