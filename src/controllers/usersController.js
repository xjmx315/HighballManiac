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
    const isCorrect = await usersService.login(password, name);
    if (isCorrect){
        const token = usersService.getToken(name, isCorrect);
        return res.status(200).json({message: "로그인 성공", token});
    }
    else {
        return res.status(401).json({message: "아이디 또는 비밀번호가 올바르지 않습니다"});
    }
};

const deleteUser = (req, res) => {
    const {password} = req.body;
    if (!password) {
        return res.status(401).json({ error: '비밀번호가 필요합니다. ' });
    }

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: '인증 토큰이 필요합니다.' });
    }
    const token = authHeader.split(' ')[1];
    
    const isSuccess = usersService.deleteUser(password, token);
    if (isSuccess) {
        res.status(201).json({ message: '유저를 삭제했습니다. '});
    }
    else {
        res.status(500).json({ message: '삭제에 실패했습니다. '});
    }
};

const getProfile = async (req, res) => {
    //프로필에 표시되어야 할 정보: 이름, 가입일, TODO: 레시피 리스트

    //유저의 이름으로 프로필 정보를 get
    const targetName = req.query.name;
    if (!targetName) {
        return res.status(400).json({ error: "검색어가 없습니다. "});
    }
    
    const ids = await usersService.getIdByName(targetName);
    if (ids.length === 0) {
        return res.status(400).json({ error: "존재하지 않는 유저 입니다. " });
    }
    const userId = ids[0].id;
    const created_at = await usersService.getCreatedDateById(userId);

    return res.status(200).json({ userName: targetName, userId, created_at })
};

const tokenCheck = (req, res) => {
    //토큰 포함 여부 check
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: '인증 토큰이 필요합니다.' });
    }
    const token = authHeader.split(' ')[1];

    //토큰 유효성 검사
    const checked = usersService.authUser(token);
    if (checked) {
        return res.status(200).json({ message: 'ok', userName: checked.userName, userId: checked.userId });
    }
    else {
        return res.status(401).json({ error: 'rejected' });
    }
};

export default {
    newUser: newUser,
    login: login,
    deleteUser: deleteUser,
    getProfile: getProfile,
    tokenCheck: tokenCheck
};