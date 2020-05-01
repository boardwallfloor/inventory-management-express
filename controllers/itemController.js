const Item = require('../models/item');
const Category = require('../models/category');

const async = require('async');
const {body, validationResult} = require('express-validator');
var debug = require('debug')('item');


exports.index = function(req,res,next){
	
	async.parallel({
		item : function(callback){
			Item.countDocuments({}, callback);
		},
		category: function(callback){
			Category.countDocuments({}, callback);
		}
	}, function(err, results){
		if(err){return next(err)};
		res.render('index',{title: 'Home', error: err, data: results});
	});


};

exports.item_list = function(req, res, next){
	async.parallel({
		item : function(callback){
			Item.find().populate('category').exec(callback);
		},
		category : function(callback){
			Category.find().exec(callback);
		},
	},function(err, results){
		if(err){return next(err);}
		console.log(results);
		res.render('item_list',{title: 'Item List', item:results.item, category: results.category})
	}
	)

}

exports.item_create_get = function(req, res, next ){
	Category.find({}, 'name').exec(function(err, results){
		console.log(results);
			res.render('item_create',{title: 'Create Item', category: results})		
			});

}

exports.item_create_post = [

	body('name', 'Item name is required').trim().isLength({min : 1}),
	body('model', 'Item model is required').trim().isLength({min : 1}),
	body('category', 'Item category is required').trim().isLength({min : 1}),
	body('status', 'Item status is required').trim().isLength({min : 1}),

 (req, res, next) => {

 	console.log(req.body.category);

 	const item = new Item(
		{
			name : req.body.name,
			model : req.body.model,
			category : req.body.category,
			status : req.body.status,
		});
 	console.log(item);

	const error = validationResult(req);

	if(!error.isEmpty()){
		console.log("error");
		Category.find({}, 'name').exec(function(err, results){
			res.render('item_create',{title: 'Create Item', category: results})		
			});
		return;

	}else{

		item.save(function(err){
			if(err){return next(err);}
			console.log("save");
			res.redirect(item.url);

		})
	}

}
]

exports.item_detail = function(req, res, next) {
	// console.log(req.params);
	Item.findById(req.params.id).exec(function(err, results){
		if(err){return next(err);}
		res.render('item_detail', {title: results.name, item: results})
		// res.send(results)
	})
}

exports.item_update_get = function(req, res, next ){
	Category.find({}, 'name').exec(function(err, results){
		console.log(results);
			res.render('item_create',{title: 'Update Item', category: results})		
			});

}

exports.item_update_post = [
	body('name', 'Item name is required').trim().isLength({min : 1}),
	body('model', 'Item model is required').trim().isLength({min : 1}),
	body('category', 'Item category is required').trim().isLength({min : 1}),
	body('status', 'Item status is required').trim().isLength({min : 1}),

 (req, res, next) => {

 	console.log(req.body.category);

 	const item = new Item(
		{
			name : req.body.name,
			model : req.body.model,
			category : req.body.category,
			status : req.body.status,
			_id : req.params.id,
		});
 	console.log(item);

	const error = validationResult(req);

	if(!error.isEmpty()){
		console.log("error");
		Category.find({}, 'name').exec(function(err, results){
			res.render('item_create',{title: 'Create Item', category: results})		
			});
		return;

	}else{

		Item.findByIdAndUpdate(req.params.id, item, function(err, results){
			if(err){return next(err);}
			res.redirect(item.url);

		})
	}

}
]

exports.item_delete_get = function(req, res, next){
	Item.findById(req.params.id).exec(function(err, results){
		res.render('item_delete', {title: 'Delete '+  results.name, item: results})
	})
}

exports.item_delete_post = function(req, res, next){
	Item.findByIdAndRemove(req.body.itemid).exec(function(err, results){
		if(err){return next(err);}
		res.redirect('/inventory/items')
	})
}