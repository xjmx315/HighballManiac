//apiRouter.js

import express from 'express';

import itemController from '../controllers/itemController.js';
import usersController from '../controllers/usersController.js';

const router = express.Router();

router.get('/item', itemController.getItems);
router.get('/item/search', itemController.searchItemByName);

router.post('/user/join', usersController.newUser);
router.post('/user/login', usersController.login);
//로그아웃은 클라이언트에서 토큰을 제거한다. 
router.delete('/user', usersController.deleteUser);

export default router;