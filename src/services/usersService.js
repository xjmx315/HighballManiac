//usersService.js
import users from '../models/users.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

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

    const token = jwt.sign(
        {userName: name, userId: id},
        'jwt_secret',
        {expiresIn: "1h"}
    );

    return token;
};

export default {
    getIdByName: getIdByName,
    addUser: addUser,
    login: login
}