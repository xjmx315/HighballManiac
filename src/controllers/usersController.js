//usersController.js
import usersService from '../services/usersService.js';
import CommonResponse from '../prototype/commonResponse.js';
import { UnauthorizedError, NotFoundError } from '../errors/CommonError.js';

const newUser = asyncHandler(async (req, res) => {
    const {email, password, name} = req.body;

    //사용자 정보 저장
    usersService.addUser({email, password, name});
    return res.status(201).json(new CommonResponse().setCode(201));
});

const login = asyncHandler(async (req, res) => {
    const {password, name} = req.body;

    const token = await usersService.login(password, name);
    return res.status(200).json(new CommonResponse().setData({token}));
});

const deleteUser = asyncHandler(async (req, res) => {
    const {password} = req.body;

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthorizedError('인증 토큰이 필요합니다. ');
    }
    const token = authHeader.split(' ')[1];
    
    await usersService.deleteUser(password, token);
    res.status(201).json(new CommonResponse().setCode(201));

});

const getProfile = asyncHandler(async (req, res) => {
    //유저의 이름으로 프로필 정보를 get
    const targetName = req.query.name;
    
    const ids = await usersService.getIdByName(targetName);
    if (ids.length === 0) {
        throw new NotFoundError("존재하지 않는 유저 입니다. ");
    }
    const userId = ids[0].id;
    const created_at = await usersService.getCreatedDateById(userId);
    console.log(created_at);

    return res.status(200).json(new CommonResponse().setData({ userName: targetName, userId, created_at }))
});

const tokenCheck = asyncHandler(async (req, res) => {
    //토큰 포함 여부 check
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthorizedError("인증 토큰이 필요합니다. ");
    }
    const token = authHeader.split(' ')[1];

    //토큰 유효성 검사
    const checked = await usersService.authUser(token);
    if (checked) {
        return res.status(200).json(new CommonResponse().setData({ userName: checked.userName, userId: checked.userId }));
    }
    else {
        throw new UnauthorizedError('rejected');
    }
});

const searchUser = asyncHandler(async (req, res) => {
    const name = req.params.name;

    const userData = await usersService.searchUser(name);
    return res.status(200).json(new CommonResponse().setData(userData));
});

export default {
    newUser,
    login,
    deleteUser,
    getProfile,
    tokenCheck,
    searchUser
};