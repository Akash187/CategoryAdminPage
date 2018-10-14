const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const {mongoose} = require('./db/mongoose');
const _ = require('lodash');
const {Category} = require('./modals/category');


const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());


//request to get all the Categories
app.get('/all',  async (req,res) => {
  try{
    const doc = await Category.find();
    res.send({doc});
  }catch (e) {
    res.status(400).send(e);
  }
});


//post request to add category like electronics, men and etc.
app.post('/category', async (req, res) => {
  const category = new Category({
    name: req.body.name,
    detail: req.body.detail
  });

  try {
    const doc = await category.save();
    res.send(doc);
  }catch (e){
    res.status(400).send(e);
  }
});


//patch request to update category
app.patch('/category/:id', async (req, res) => {
  const id = req.params.id;  // id of category
  const body = _.pick(req.body, ['name', 'detail']);

  if(!ObjectID.isValid(id)){
    res.status(404).send();
  }

  try{
    const category = await Category.findByIdAndUpdate(id, {$set: body}, {new: true});
    if(!category){
      res.status(404).send();
    }
    res.send({category});
  }
  catch (e){
    res.status(400).send();
  }
});


//delete request to delete category
app.delete('/category/:id', async (req, res) => {
  const id = req.params.id;

  if(!ObjectID.isValid(id)){
    res.status(404).send();
  }

  try{
    const category = await Category.findByIdAndRemove(id);
    if(!category){
      res.status(404).send();
    }
    res.send({category});
  }catch (e){
    res.status(400).send();
  }
});


//post request to add subcategory like mobile, jeans and etc
app.post('/category/:id', async (req, res) => {
  const id = req.params.id;
  const body = _.pick(req.body, ['name', 'position']);

  if(!ObjectID.isValid(id)){
    res.status(404).send();
  }

  try{
    const category = await Category.findOne({"_id":id});
    category.subcategory.push(body);
    await category.save();
    res.send({ category });
  } catch(e){
    res.status(400).send();
  }
});


//patch request to update subcategory
app.patch('/subcategory/:id', async (req, res) => {
  const id = req.params.id; //id for subcategory
  const body = _.pick(req.body, ['name', 'position']);

  if(!ObjectID.isValid(id)){
    res.status(404).send();
  }

  try{
    const category = await Category.findOne({"subcategory._id":id});
    const subcategory = category.subcategory.id(req.params.id);
    subcategory.set(body);
    await category.save();
    res.send({ category });
  } catch(e){
    res.status(400).send(e)
  }
});


//delete request to delete subcategory
app.delete('/subcategory/:id', async (req, res) => {
  const id = req.params.id; //id of subcategory

  if(!ObjectID.isValid(id)){
    res.status(404).send();
  }

  try {
    const category = await Category.findOne({"subcategory._id": id});
    const subcategory = category.subcategory.id(id);
    subcategory.remove();
    await category.save();
    res.send({category});
  } catch(e){
    res.status(400).send();
  }
});


//post request to add item like Samsung, oppo and etc.
app.post('/subcategory/:id', async (req, res) => {
  const id = req.params.id; //id of subcategory
  const body = _.pick(req.body, ['name', 'position']);

  if(!ObjectID.isValid(id)){
    res.status(404).send();
  }

  try{
    const category = await Category.findOne({"subcategory._id": id});
    const subcategory = category.subcategory.id(id);
    subcategory.items.push(body);
    await category.save();
    res.send({ category });
  }catch (e) {
    res.status(400).send();
  }
});


//patch request to update item
app.patch('/item/:id1/:id2', async (req, res) => {
  const id1 = req.params.id1; //id of subcategory
  const id2 = req.params.id2; //id of item to be updated
  const body = _.pick(req.body, ['name', 'position']);

  if(!ObjectID.isValid(id1)){
    return res.status(404).send();
  }
  if(!ObjectID.isValid(id2)){
    return res.status(404).send();
  }

  try{
    const category = await Category.findOne({"subcategory._id": id1});
    const subcategory = category.subcategory.id(id1);
    const item = subcategory.items.id(id2);
    item.set(body);
    await category.save();
    res.send({ category });
  } catch (e){
  res.status(400).send(e);
  }
});


//delete request to delete item
app.delete('/item/:id1/:id2', async (req, res) => {
  const id1 = req.params.id1; //id of subcategory
  const id2 = req.params.id2; //id of item to be updated

  if(!ObjectID.isValid(id1)){
    return res.status(404).send();
  }
  if(!ObjectID.isValid(id2)){
    return res.status(404).send();
  }

  try{
    const category = await Category.findOne({"subcategory._id": id1});
    const subcategory = category.subcategory.id(id1);
    const item = subcategory.items.id(id2);
    item.remove();
    await category.save();
    res.send({ category });
  } catch (e){
    res.status(400).send(e)
  }
});


app.listen(port, () => {
  console.log(`Started on port ${port}`);
});
