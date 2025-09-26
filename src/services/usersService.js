//usersService.js
import userModel from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { ConflictError, ValidationError, NotFoundError, UnauthorizedError } from '../errors/CommonError.js';

dotenv.config();
const JWT_KEY = process.env.JWT_KEY;

const _getToken = (userName, userId) => {
    //name과 id 정보가 담긴 토큰을 생성
    //토큰 발급
    const token = jwt.sign(
        {userName: userName, userId: userId},
        JWT_KEY,
        {expiresIn: "1h"}
    );
    return token;
};

const _passwordCheck = async (password, userId) => {
    const userPasswords = await userModel.getPasswordById(userId).then();
    const hashedPassword = userPasswords[0].password;
    const passwordCheck = await bcrypt.compare(password, hashedPassword);
    
    if (!passwordCheck){
        return true;
    }
    return false;
}

const getIdByName = async (name) => {
    //유저 존재: [ { id: 4 } ]
    //유저 x: []
    return await userModel.getIdByName(name);
};

const getCreatedDateById = async (id) => {
    //성공: 2025-05-28T16:43:17.000Z
    const date = await userModel.getCreatedDateById(id);
    if (data.length === 0) {
        throw new NotFoundError("존재하지 않는 id 입니다. ")
    }
    return date[0].created_at;
};

const addUser = async (userData) => {
    const {email, password, name} = userData;
    //id, pw 유효성 검사
    if (!name || !password) {
        throw new ValidationError("id와 비밀번호는 필수 항목입니다. ")
    }

    //id 중복 검사
    const ids = await userModel.getIdByName(name);
    if (ids.length !== 0) {
        throw new ConflictError("이미 존재하는 id입니다. ");
    }

    //비밀번호 암호화
    const hashedPassword = await bcrypt.hash(password, 10);

    return await userModel.addUser(email, hashedPassword, name);
};

const login = async (password, name) => {
    //비밀번호와 이름을 검증해서 맞으면 토큰 반환

    //입력값 검증
    if (!name || !password) {
        throw new ValidationError("id와 비밀번호는 필수 항목입니다. ");
    }

    //유저 검색
    const ids = await userModel.getIdByName(name);
    if (ids.length === 0){
        throw new NotFoundError("존재하지 않는 id 입니다. ")
    }
    const id = ids[0].id;

    //비밀번호 검증
    const passwordCheck = await _passwordCheck(password, id);
    
    if (!passwordCheck){
        throw new UnauthorizedError("비밀번호가 올바르지 않습니다. ");
    }

    //토큰 발급
    return _getToken(name, id);
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
        return false;
    }
};

const deleteUser = async (password, token) => {
    //성공하면 true 반환

    //토큰 유효성 확인
    const payload = await authUser(token);
    if (!payload) {
        throw new UnauthorizedError("토큰이 유효하지 않습니다. ");
    }
    const userId = payload.userId;

    //비밀번호 확인
    const isPasswordCorrect = await _passwordCheck(password, userId);

    //아이디 삭제
    if (!isPasswordCorrect){
        throw new UnauthorizedError("비밀번호가 올바르지 않습니다. ");
    }

    userModel.deleteUser(userId);
    return true;
};

const searchUser = async (name) => {
    const userData = await userModel.searchUser(name);
    return userData;
};

export default {
    getIdByName,
    getCreatedDateById,
    addUser,
    login,
    authUser,
    deleteUser,
    searchUser
}