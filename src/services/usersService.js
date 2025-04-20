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
    //비밀번호 검증
    const passwordCheck = await bcrypt.compare(password, user.password);
    if (!passwordCorrect){
        return false;
    }

    const token = jwt.sign(
        {userName: name},
        'jwt_secret',
        {expiresIn: "1h"}
    );
};


export default {
    getIdByName: getIdByName,
    addUser: addUser
}