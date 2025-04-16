//apiRouter.js

import express from 'express';

import itemController from '../controllers/itemController.js';
import usersController from '../controllers/usersController.js';


const router = express.Router();

router.get('/item', itemController.getItems);
router.get('/item/search', itemController.searchItemByName);

router.post('/user/join', usersController.newUser);
router.post('/user/login', usersController.login);
router.delete('/user', usersController.deleteUser);

export default router;