//apiRouter.js

import express from 'express';

import itemController from '../controllers/itemController.js';
import usersController from '../controllers/usersController.js';
import recipeController from '../controllers/recipeController.js';

const router = express.Router();


//Item--------
router.get('/item', itemController.getItems);
router.get('/item/search', itemController.searchItemByName);


//User--------
router.post('/user/join', usersController.newUser);
router.post('/user/login', usersController.login);
//로그아웃은 클라이언트에서 토큰을 제거한다. 
router.get('/user', usersController.getProfile);
router.get('/user/tokenCheck', usersController.tokenCheck);
router.delete('/user', usersController.deleteUser);
//계정 정보는 db에서 삭제되나 해당 유저가 올린 레시피도 삭제되게 해야함. 
//유저가 삭제된 이후에도 토큰이 유효하기 때문에 로그인이 성공할 수 있음. 


//Recipe--------
router.post('/recipe', recipeController.newRecipe);
router.get('/recipe/popualer', recipeController.getPopualer);
router.get('/recipe/newest', recipeController.getNewest);
router.get('/recipe/random', recipeController.getRandom);
router.get('/recipe', recipeController.getById);
router.get('/recipe/search', recipeController.searchRecipeByName);
router.get('/recipe/category', recipeController.getRecipeByCategory);

export default router;