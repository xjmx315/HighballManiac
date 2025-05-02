//usersService.js
import users from '../models/users.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const JWT_KEY = dotenv.env.JWT_KEY || 'noJWT_KEY';

const getIdByName = async (name) => {
    return await users.getIdByName(name);
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

    //유저 검색
    const ids = await users.getIdByName(name);
    if (ids.length === 0){
        return false;
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
};

const authUser = (token) => {
    //유저 인증: 토큰을 받아서 유효하다면 유저 아이디를 반환. 
    //유효하지 않으면 -1을 반환. 
    if (!token) {
        return -1;
    }

    try{
        const decoded = jwt.verify(token, JWT_KEY);
        return decoded;
    }
    catch (e) {
        console.log("token error: ", e);
        return -1;
    }
};

const deleteUser = (password, name) => {
    
};

export default {
    getIdByName: getIdByName,
    addUser: addUser,
    login: login
}