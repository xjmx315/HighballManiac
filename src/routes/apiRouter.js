//apiRouter.js

import express from 'express';

import itemController from '../controllers/itemController.js';


const router = express.Router();

router.get('/item', itemController.getItems);
router.get('/item/search', itemController.searchItemByName);

export default router;