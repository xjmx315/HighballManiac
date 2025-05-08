//usersService.js
import users from '../models/users.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const JWT_KEY = process.env.JWT_KEY || 'noJWT_KEY';

const getIdByName = async (name) => {
    return await users.getIdByName(name);
};

const getCreatedDateById = async (id) => {
    const date = await users.getCreatedDateById(id);
    return date[0].created_at;
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

const authUser = (token) => {
    //유저 인증: 토큰을 받아서 유효하다면 유저 아이디와 이름을 반환. 
    //유효하지 않으면 false을 반환. 
    if (!token) {
        return false;
    }

    try{
        const decoded = jwt.verify(token, JWT_KEY);
        return decoded;
    }
    catch (e) {
        console.log("token error: ", e);
        return false;
    }
};

const deleteUser = async (password, token) => {
    //토큰 유효성 확인
    const payload = authUser(token);
    if (!payload) {
        return false;
    }
    console.log("payload: ", payload);

    //비밀번호 확인
    const userId = await login(password, payload.userName);
    console.log("isCorrest: ", isCorrect);

    //아이디 삭제
    if (isCorrect === payload.id){
        try {
            users.deleteUser(isCorrect);
            return true;
        }
        catch (e) {
            console.log("error: ", e);
            return false;
        }
    }
    return false;
};

export default {
    getIdByName: getIdByName,
    getCreatedDateById: getCreatedDateById,
    addUser: addUser,
    login: login,
    getToken: getToken,
    authUser: authUser,
    deleteUser: deleteUser,
}