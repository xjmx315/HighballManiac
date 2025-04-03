//apiRouter.js

import express from 'express';

import itemController from '../controllers/itemController';


const router = express.Router();

router.get('/item', itemController.getItems);
router.post('/item/search/:name', itemController.searchByName);

export default router;