let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let ItemSchema = new Schema({
  name: {type: String, unique: true, required: true},
  position: Number,
  parent_id : String,
  img: String,
});

let SubCategorySchema = new Schema({
  name: {type: String, unique: true, required: true},
  position: Number,
  img: String,
  items: [ItemSchema]
});

let CategoryModelSchema = new Schema({
  name: {type: String, unique: true, required: true},
  detail: String,
  position: Number,
  img: String,
  subcategory: [SubCategorySchema],
});

let Category = mongoose.model('Category', CategoryModelSchema);

module.exports = {Category};