//usersController.js
import usersService from '../services/usersService.js';

const newUser = async (req, res) => {
    const {email, password, name} = req.body;
    
    //id, pw 유효성 검사
    if (!name || !password) {
        return res.status(400).json({message: "id와 비밀번호는 필수 항목입니다"});
    }

    //id 중복 검사
    const ids = await usersService.getIdByName(name);
    if (ids.length !== 0) {
        return res.status(409).json({message: "이미 존재하는 id입니다. "});
    }

    //사용자 정보 저장
    usersService.addUser({email, password, name});
    return res.status(201).json({message: "생성 완료"});
};

const login = async (req, res) => {
    const {password, name} = req.body;

    if (!password || !name){
        return res.status(400).json({message: "id와 비밀번호는 필수 항목입니다"});
    }
    const token = await usersService.login(password, name);
    if (token){
        return res.status(200).json({message: "로그인 성공", token});
    }
    else {
        return res.status(202).json({message: "아이디 또는 비밀번호가 올바르지 않습니다"});
    }

    return res.status(200).json({message: "로그인 성공", token});
};

const deleteUser = (req, res) => {
    const {password, name} = req.body;
    usersService.deleteUser(password, name);
    
};

export default {
    newUser: newUser,
    login: login,
    deleteUser: deleteUser
};