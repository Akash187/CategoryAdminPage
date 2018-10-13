let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let ItemSchema = new Schema({
  name: {type: String, unique: true, required: true},
  position: Number
});

let SubCategorySchema = new Schema({
  name: {type: String, unique: true, required: true},
  position: Number,
  items: [ItemSchema]
});

let CategoryModelSchema = new Schema({
  name: {type: String, unique: true, required: true},
  detail: String,
  subcategory: [SubCategorySchema],
});

let Category = mongoose.model('Category', CategoryModelSchema);

module.exports = {Category};