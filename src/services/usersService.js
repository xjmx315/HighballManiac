//usersService.js
import users from '../models/users.js';
import bcrypt from 'bcryptjs';

const getIdByName = async (name) => {
    return await users.getIdByName(name);
};

const addUser = async (userData) => {
    const {email, password, name} = userData;
    
    //비밀번호 암호화
    const hashedPassword = await bcrypt.hash(password, 10);
    
    return await users.addUser(email, hashedPassword, name);
};

export default {
    getIdByName: getIdByName,
    addUser: addUser
}