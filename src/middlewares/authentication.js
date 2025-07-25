//authentication.js

import CommonResponse from "../prototype/commonResponse.js";
import usersService from "../services/usersService.js";

const authentication = async (req, res, next) => {
    //authorization 헤더 검증
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json(new CommonResponse(false, 401, "인증 토큰이 필요합니다. (authorization 헤더를 포함해야 합니다.)"));
    }
    const token = authHeader.split(' ')[1];

    try {
        //토큰 검증
        const payload = await usersService.authUser(token);
        if (!payload) {
            return res.status(401).json(new CommonResponse(false, 401, "인증 토큰이 유효하지 않습니다. "));
        }

        //인증 정보 삽입하고 다음 MW로
        req.userInfo = payload;
        next();
    }
    catch (e) {
        console.log(e);
        return res.status(401).json(new CommonResponse(false, 500, "정의되지 않은 예외가 발생했습니다. "));
    }
}

export default authentication;