//apiRouter.js

import express from 'express';

import itemController from '../controllers/itemController.js';
import usersController from '../controllers/usersController.js';
import recipeController from '../controllers/recipeController.js';
import adminController from '../controllers/adminController.js';
import ingredientController from '../controllers/ingredientController.js';

import validateTable from '../middlewares/validateTable.js';
import authentication from '../middlewares/authentication.js';

import multer from 'multer';

const upload = multer({ dest: adminController.csvSeedPath });
const router = express.Router();


//Item--------
router.get('/item', itemController.getItems);
router.get('/item/search', itemController.searchItemByName);
//router.post('/item', itemController.newItem);

//Ingredient--------
router.get('/ingredient/search', ingredientController.searchIngredientByName);
router.get('/ingredient', ingredientController.getById);
//router.post('/ingredient', ingredientController.newIngredient);


//User--------
router.post('/user/join', usersController.newUser);
router.post('/user/login', usersController.login);
//로그아웃은 클라이언트에서 토큰을 제거한다. 
router.get('/user', usersController.getProfile);
router.get('/user/tokenCheck', usersController.tokenCheck);
router.delete('/user', usersController.deleteUser);
//계정 정보는 db에서 삭제되나 해당 유저가 올린 레시피도 삭제되게 해야함. 


//Recipe--------
router.post('/recipe', authentication, recipeController.newRecipe);
router.get('/recipe/popualer', recipeController.getPopualer);
router.get('/recipe/newest', recipeController.getNewest);
router.get('/recipe/random', recipeController.getRandom);
router.get('/recipe/search', recipeController.searchRecipeByName);
router.get('/recipe/category', recipeController.getRecipeByCategory);
//router.get('/recipe/including', recipeController.searchByIngredient);
router.get('/recipe/:id', recipeController.getById);


//admin--------
router.get('/admin/db/init', adminController.initDB);
router.get('/admin/db/export/:tableName', validateTable, adminController.exportTable);
router.post('/admin/db/update/:tableName', validateTable, upload.single('file'), adminController.updateTable);
router.get('/admin/db/delete/:tableName', validateTable, adminController.deleteTable);
//TODO: 트랜젝션 처리

export default router;