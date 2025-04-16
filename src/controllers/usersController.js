//usersController.js
import usersService from '../services/usersService.js';

const newUser = (req, res) => {
    const {email, password, id} = req.body;
    if (!id || !password) {
        return res.status(400).json({message: "id와 비밀번호는 필수 항목입니다"});
    }

};

const login = (req, res) => {
    
};


const deleteUser = (req, res) => {

};



export default {
    newUser: newUser,
    login: login,
    deleteUser: deleteUser
};