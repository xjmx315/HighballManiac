//apiRouter.js

/*
About ensureParams
-기능
    1. 필수 파라미터 채크
    2. 파라미터의 형식 체크(숫자인지)
-사용법
    ensureParams().onParam(['id']).shouldNumber(['id']).build();
    -> .onParam(['id']) : id 필드가 param에 있는지 체크
    -> .shouldNumber(['id']) : id 필드가 숫자인지 체크
    -> .build() : 설정된 미들웨어 함수를 반환
-사용예시
    1. 변수에 저장해두었다가 사용
        const numberIdOnParam = ensureParams().onParam(['id']).shouldNumber(['id']).build();
    2. router에 직접 삽입
        router.post('/user/join', 
            ensureParams().onBody(['email', 'password', 'name']).build(),
            usersController.newUser
        );
-기대 효과
    1. 코드 중복 감소
    2. 코드 가독성 향상
    3. 일괄적인 응답 처리
*/

import express from 'express';

import itemController from '../controllers/itemController.js';
import usersController from '../controllers/usersController.js';
import recipeController from '../controllers/recipeController.js';
import adminController from '../controllers/adminController.js';
import ingredientController from '../controllers/ingredientController.js';
import tagController from '../controllers/tagController.js';

//middlewares
import validateTable from '../middlewares/validateTable.js';
import authentication from '../middlewares/authentication.js';
import ensureParams from '../middlewares/ensureParams.js';

import multer from 'multer';

const upload = multer({ dest: adminController.csvSeedPath });
const router = express.Router();

//ensureParams
const numberIdOnParam = ensureParams().onParam(['id']).shouldNumber(['id']).build();
const numberIdOnQuery = ensureParams().onQuery(['id']).shouldNumber(['id']).build();

//Item--------
router.get('/item', itemController.getItems);
router.get('/item/search', itemController.searchItemByName);
//router.post('/item', itemController.newItem);

//Ingredient--------
router.get('/ingredient/search', ingredientController.searchIngredientByName);
router.get('/ingredient', ingredientController.getById);
//router.post('/ingredient', ingredientController.newIngredient);


//User--------
router.post('/user/join', 
    ensureParams().onBody(['email', 'password', 'name']).build(),
    usersController.newUser
);
router.post('/user/login',
    ensureParams().onBody(['password', 'name']).build(),
    usersController.login
);
//로그아웃은 클라이언트에서 토큰을 제거한다. 
router.get('/user', 
    ensureParams().onQuery(['name']).build(),
    usersController.getProfile
);
router.get('/user/tokenCheck', usersController.tokenCheck);
router.delete('/user', 
    ensureParams().onBody(['password']).build(),
    usersController.deleteUser
);
router.get('/user/search/:name', 
    ensureParams().onParam(['name']).build(),
    usersController.searchUser
);
//계정 정보는 db에서 삭제되나 해당 유저가 올린 레시피도 삭제되게 해야함. 


//Recipe--------
router.post('/recipe', authentication, 
    ensureParams().onBody(['name', 'description', 'recipe', 'alcohol', 'ingredients', 'items', 'tags']).build(),
    recipeController.newRecipe
);
//Tag 관련
router.post('/recipe/tag', authentication, 
    ensureParams().onBody(['recipeId', 'tagId']).build(),
    recipeController.addTag
);
router.delete('/recipe/tag', 
    ensureParams().onBody(['recipeId', 'tagId']).build(),
    authentication, recipeController.deleteTag
);
router.put('/recipe/tag', 
    authentication, 
    ensureParams().onBody(['recipeId', 'tagList']).shouldNumber(['recipeId']).build(), 
    recipeController.setTags
);
router.get('/recipe/tag/:id', numberIdOnParam, recipeController.getTags);
//다양한 기준 검색
router.get('/recipe/ingredients/:id', 
    numberIdOnParam, 
    recipeController.getItemsAndIngredients
);
router.get('/recipe/writtenby/:id', 
    numberIdOnParam, 
    recipeController.getByUserId
);
router.get('/recipe/populer', recipeController.getPopuler);
router.get('/recipe/newest', recipeController.getNewest);
router.get('/recipe/random', recipeController.getRandom);
router.get('/recipe/search', recipeController.searchRecipeByName);
router.get('/recipe/including', 
    ensureParams().onQuery(['items']).build(), 
    recipeController.searchByIngredient
);
router.get('/recipe/:id', 
    numberIdOnParam,
    recipeController.getById
);

//Tags--------
router.get('/tag', 
    ensureParams().onQuery(['name']).build(), 
    tagController.searchTags
);
router.get('/tag/id/:id', 
    numberIdOnParam, 
    tagController.getById
);
router.get('/tag/recipe/:id', 
    numberIdOnParam, 
    tagController.getRecipes
);
router.get('/tag/all', tagController.getAllTags);

//admin--------
router.get('/admin/db/init', 
    ensureParams().onBody(['adminPassword']).build(),
    adminController.initDB
);
router.get('/admin/db/export/:tableName', 
    validateTable, 
    adminController.exportTable
);
router.post('/admin/db/update/:tableName', 
    validateTable, upload.single('file'), 
    adminController.updateTable
);
router.get('/admin/db/delete/:tableName', 
    validateTable, 
    adminController.deleteTable
);
//TODO: 트랜젝션 처리

export default router;