//usersService.js
import users from '../models/users.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const JWT_KEY = process.env.JWT_KEY || 'noJWT_KEY';

const getIdByName = async (name) => {
    //유저 존재: [ { id: 4 } ]
    //유저 x: []
    return await users.getIdByName(name);
};

const getCreatedDateById = async (id) => {
    //정상: 2025-05-28T16:43:17.000Z
    try {
        const date = await users.getCreatedDateById(id);
        return date[0].created_at;
    }
    catch (e) {
        console.log("getCreatedDateById Error: ", e);
        return "error";
    }
};

const addUser = async (userData) => {
    const {email, password, name} = userData;
    
    //비밀번호 암호화
    const hashedPassword = await bcrypt.hash(password, 10);

    return await users.addUser(email, hashedPassword, name);
};

const login = async (password, name) => {
    //비밀번호와 이름을 검증해서 맞으면 아이디를 반환. 
    //아니면 false 반환

    //입력값 검증
    if (!name || !password) {
        console.log("login error: 이름 또는 비밀번호가 전달되지 않았습니다. ")
        return false;
    }

    //유저 검색
    const ids = await users.getIdByName(name);
    if (ids.length === 0){
        return false; //해당 이름의 유저 없음. 
    }
    const id = ids[0].id;

    //비밀번호 검증
    const hashedPassword = await users.getPasswordById(id)
    .then((originPassword) => {
        return originPassword[0].password;
    });

    const passwordCheck = await bcrypt.compare(password, hashedPassword);
    
    if (!passwordCheck){
        return false;
    }

    return id;
};

const getToken = (userName, userId) => {
    //name과 id 정보가 담긴 토큰을 생성
    //토큰 발급
    const token = jwt.sign(
        {userName: userName, userId: userId},
        JWT_KEY,
        {expiresIn: "1h"}
    );
    return token;
};

const authUser = async (token) => {
    //인증 성공: { userName: 'ddd', userId: 3, iat: 1749024408, exp: 1749028008 }
    //유효x: false 
    if (!token) {
        return false;
    }

    try{
        const decoded = jwt.verify(token, JWT_KEY);
        //유저가 실존하는지 검증
        const isRealUser = await getIdByName(decoded.userName);
        if (isRealUser.length === 1 && isRealUser[0].id === decoded.userId){
            return decoded;
        }
        return false;
    }
    catch (e) {
        console.log("token error: ", e);
        return false;
    }
};

const deleteUser = async (password, token) => {
    //{isSucceed, message 반환}

    //토큰 유효성 확인
    const payload = await authUser(token);
    if (!payload) {
        return {isSucceed: false, message: "토큰이 유효하지 않습니다. "};
    }
    //console.log("payload: ", payload);

    //비밀번호 확인
    const userId = await login(password, payload.userName);
    //console.log("login: ", userId);

    //아이디 삭제
    if (userId && userId === payload.userId){
        try {
            users.deleteUser(userId);
            return {isSucceed: true, message: "Succeed"};
        }
        catch (e) {
            console.log("error: ", e);
            return {isSucceed: false, message: 0};
        }
    }
    return {isSucceed: false, message: "비밀번호가 올바르지 않습니다. "};
};

const searchUser = async (name) => {
    try {
        const userData = await users.searchUser(name);
        console.log(userData);
        return userData;
    }
    catch (e) {
        console.log(e);
        return {err: e};
    }
};

export default {
    getIdByName,
    getCreatedDateById,
    addUser,
    login,
    getToken,
    authUser,
    deleteUser,
    searchUser
}