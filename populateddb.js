#! /usr/bin/env node

console.log("Populate DB");
// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async')
var Category = require('./models/category')
var Item = require('./models/item')


var mongoose = require('mongoose');
// var mongoDB = userArgs[0];
// mongoose.connect(mongoDB, { useNewUrlParser: true });
mongoose.connect('mongodb://localhost/inventory');
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var categories = [];
var items = [];

function categoryCreate(name, description, cb) {
  
  categorydetail = {
    name: name,
    description: description,
  }

  const category = new Category(categorydetail);
       
  category.save(function (err) {
    if (err) {
      console.log('Error at creating category : ' + err);
      cb(err, null)
      return;
    }
    console.log('New Category: ' + category);
    categories.push(category)
    cb(null, category);
  });
}

function itemCreate(name,model, category, status, cb) {
  itemdetail = {
    name: name,
    model: model,
    category: category,
    status: status,
  }

  const item = new Item(itemdetail);
       
  item.save(function (err) {
    if (err) {
      console.log('Error at creating : ' + item);
      cb(err, null);
      return;
    }
    console.log('New Item: ' + item);
    items.push(item)
    cb(null, name);
  }   );
}




function createCategory(cb) {
    async.series([
        function(callback){
          categoryCreate('Air Conditioner','An air conditioner is a system or a machine that treats air in a defined, usually enclosed area via a refrigeration cycle in which warm air is removed and replaced with cooler air.', callback);
        },
        function(callback){
          categoryCreate('Dishwasher','A machine for cleaning dishware and cutlery automatically. Unlike manual dishwashing, which relies largely on physical scrubbing to remove soiling, the mechanical dishwasher cleans by spraying hot water, typically between 45 and 75 °C (110 and 170 °F), at the dishes, with lower temperatures used for delicate items.', callback);
        },
        function(callback){
          categoryCreate('Clothes Dryer','A powered household appliance that is used to remove moisture from a load of clothing, bedding and other textiles, usually shortly after they are washed in a washing machine. Otherwise, clothes may also be dried by natural evaporation and, if available, sunlight, on an outdoor or indoor clothes line or clothes horse. ', callback);
        },
        function(callback){
          categoryCreate('Juicer','A tool used to extract juice from fruits, herbs, leafy greens and other types of vegetables in a process called juicing. It crushes, grinds, and/or squeezes the juice out of the pulp.', callback);
        },
        function(callback){
          categoryCreate('Mixer','A kitchen device that uses a gear-driven mechanism to rotate a set of "beaters" in a bowl containing the food or liquids to be prepared by mixing them. ', callback);
        },
        function(callback){
          categoryCreate('Meat Grinder','A kitchen appliance for fine chopping (\'mincing\') and/or mixing of raw or cooked meat, fish, vegetables or similar food. It replaces tools like the mincing knife, for example, which is also used to produce minced meat, filling, etc. ', callback);
        },
        ],
        // optional callback
        cb);
}


function createItem(cb) {
    async.parallel([
        function(callback){
          itemCreate('LG 8000-BTU 330-sq ft 115-Volt Through-The-Wall Air Conditioner ENERGY STAR','#LT0816CER', categories[0], 'Avalaible', callback);
        },
        function(callback){
          itemCreate('Whirlpool 55-Decibel Filtration Built-In Dishwasher (White) (Common: 24-in; Actual: 23.875-in) ENERGY STAR','#WDF330PAHW', categories[1], 'Avalaible', callback);
        },
        function(callback){
          itemCreate('Samsung 7.2-cu ft Electric Dryer (White)','#DV40J3000EW', categories[2], 'Avalaible', callback);
        },
        function(callback){
          itemCreate('Cuisinart 34-oz Stainless Steel and Black Juice Extractor','#CJE-1000', categories[3], 'Ordered', callback);
        },
        function(callback){
          itemCreate('KitchenAid 4.5-Quart 10-Speed White Stand Mixer','#KSM75WH', categories[4], 'Avalaible', callback);
        },
        function(callback){
          itemCreate('MegaChef MegaChef 1200 Watt Powerful Automatic Meat Grinder for Household Use','#84997889M', categories[5], 'Avalaible', callback);
        },
        function(callback){
          itemCreate('GE 64-Decibel and Hard Food Disposer Built-In Dishwasher (White) (Common: 24-in; Actual: 24-in)','#GSD2100VWW', categories[1], 'Empty', callback);
        },
        function(callback){
          itemCreate('Whirlpool 7-cu ft Electric Dryer (White) - While Supplies Last','#WED4815EW', categories[2], 'On Road', callback);
        },
        function(callback){
          itemCreate('Chard Chard FG-800SS Stainless Steel Electric Grinder','#FG-800SS', categories[5], 'On Road', callback);
        },
        ],
        // optional callback
        cb);
}
 
async.series([
    createCategory,
    createItem
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    } 
    // All done, disconnect from database 
    console.log("Finished populating");
    mongoose.connection.close();
}); 