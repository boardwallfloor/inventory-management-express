const Category = require('../models/category');
const Item = require('../models/item');

const	async = require('async');
const { body, validationResult } = require('express-validator');

exports.category_list = function(req, res, next){
	Category.find().exec(function(err, results){
		if(err){return next(err);}
		res.render('category_list',{title: 'Category List', category: results})
	})
}

exports.category_create_get = function(req, res, next){
	res.render('category_create',{title: 'Create Category'});

	// res.send("WIP");
}

exports.category_create_post = [
	body('name', 'Category name is required').trim().isLength({min : 1}),
	body('description', 'Category description is required').trim().isLength({min : 1}),
 (req, res, next) => {
 	const category = new Category(
		{
			name : req.body.name,
			description : req.body.description,
		});
	const error = validationResult(req);
	if(!error.isEmpty()){
		console.log("output");
		res.render('category_create',{title: 'Create Category', error: error});
		return;
	}else{
		category.save(function(err){
			if(err){return next(err);}
			res.redirect(category.url);
		})
	}

}
]

exports.category_detail = function(req, res, next) {
	Category.findById(req.params.id).exec(function(err, results){
		if(err){return next(err);}
		res.render('category_detail', {title: results.name, category: results})
		// res.send("WIP DETAIL")
	})
}

exports.category_update_get = function(req, res, next) {
	res.render('category_create',{title: 'Update Category'});
}

exports.category_update_post = [
	body('name', 'Category name is required').trim().isLength({min : 1}),
	body('description', 'Category description is required').trim().isLength({min : 1}),
 (req, res, next) => {
 	const category = new Category(
		{
			name : req.body.name,
			description : req.body.description,
			_id : req.params.id,
		});
	const error = validationResult(req);
	if(!error.isEmpty()){
		console.log("output");
		res.render('category_create',{title: 'Create Category', error: error});
		return;
	}else{
		Category.findByIdAndUpdate(req.params.id, category, function(err, results){
			if(err){return next(err);}
			res.redirect(category.url);
		})
	}

}
]

exports.category_delete_get = function(req, res, next){
	async.parallel({
		category : function(callback){
			Category.findById(req.params.id).exec(callback);
		},
		item : function(callback){
			Item.find({'category' : req.params.id}).exec(callback);
		}
	}, function(err ,results){
		if(err){return next(err);}
		res.render('category_delete', {title: 'Delete '+ results.category.name, item:results.item, category : results.category })
	}
	)
}

exports.category_delete_post = function(req, res, next){
	async.parallel({
		category : function(callback){
			Category.findById(req.body.categoryid).exec(callback);
		},
		item : function(callback){
			Item.find({'category' : req.body.categoryid}).exec(callback);
		}
	},function(err, results){
		if(err){return next(err);}

		if(results.item.length > 0){
			res.render('category_delete', {title: 'Delete '+ results.category.name, item:results.item, category : results.category });
			return;
		}else{
			Category.findByIdAndRemove(req.body.categoryid, function(err){
				if(err){return next(err);}
				res.redirect('/inventory/categories')
			})
		}
	}
	)

	// res.send(req.body);
}