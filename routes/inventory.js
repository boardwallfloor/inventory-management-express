var express = require('express');
var router = express.Router();

const item_controller = require('../controllers/itemController');
const category_controller = require('../controllers/categoryController');

//Home page
router.get('/', item_controller.index);

//Post create
router.post('/item/create', item_controller.item_create_post);
router.post('/category/create', category_controller.category_create_post);

//Get create
router.get('/item/create', item_controller.item_create_get);
router.get('/category/create', category_controller.category_create_get);

// Get update
router.get('/item/:id/update', item_controller.item_update_get);
router.get('/category/:id/update', category_controller.category_update_get);

//Post update
router.post('/item/:id/update', item_controller.item_update_post);
router.post('/category/:id/update', category_controller.category_update_post);

//Get detail
router.get('/item/:id', item_controller.item_detail);
router.get('/category/:id', category_controller.category_detail);

//Get delete
router.get('/item/:id/delete', item_controller.item_delete_get);
router.get('/category/:id/delete', category_controller.category_delete_get);

//Post delete
router.post('/item/:id/delete', item_controller.item_delete_post);
router.post('/category/:id/delete', category_controller.category_delete_post);

// Get list
router.get('/items', item_controller.item_list);
router.get('/categories', category_controller.category_list)

module.exports = router;
