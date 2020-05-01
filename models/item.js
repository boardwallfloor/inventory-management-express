var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ItemSchema = new Schema ({
	name:{type: String, required: true, max:100},
	model:{type: String, required: true, max:100},
	category:{type: Schema.Types.ObjectId, ref:'Category', required:true},
	status:{type: String, required:true, enum:['Avalaible','Empty','Ordered','On Road'], default: 'Avalaible'},
	
})

ItemSchema.virtual('url').get(function(){
	return '/inventory/item/' + this._id;
})


module.exports = mongoose.model('Item', ItemSchema);