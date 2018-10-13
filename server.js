let express = require('express');
let bodyParser = require('body-parser');
let {ObjectID} = require('mongodb');
let {mongoose} = require('./db/mongoose');
let _ = require('lodash');
let {Category} = require('./modals/category');


let app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());


//request to get all the Categories
app.get('/all', (req,res) => {
  Category.find().then((doc) => {
    res.send({doc});
  }, (e) => {
    res.status(400).send(e);
  });
},(e) => {
  console.log("Error in get /all");
});


//post request to add category like electronics, men and etc.
app.post('/category', (req, res) => {
  let category = new Category({
    name: req.body.name,
    detail: req.body.detail
  });
  category.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
  }, (e) => {
  console.log("Error in post /category");
});


//patch request to update category
app.patch('/category/:id', (req, res) => {
  let id = req.params.id;
  let body = _.pick(req.body, ['name', 'detail']);

  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  }

  Category.findByIdAndUpdate(id, {$set: body}, {new: true}).then((category) => {
    if(!category){
      return res.status(404).send();
    }
    res.send({category});
  }).catch((e) => {
    res.status(400).send();
  })
},(e) => {
  console.log("Error in patch /category/:id");
});


//delete request to delete category
app.delete('/category/:id', (req, res) => {
  let id = req.params.id;
  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  }
  Category.findByIdAndRemove(id).then((category) => {
    if(!category){
      return res.status(404).send();
    }
    return res.send({category});
  }).catch((e) => {
    res.status(400).send();
  })
},(e) => {
  console.log("Error in delete /category/:id");
});


//post request to add subcategory like mobile, jeans and etc
app.post('/category/:id', (req, res) => {
  let id = req.params.id;
  let body = _.pick(req.body, ['name', 'position']);

  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  }

  Category.findOne({"_id":id}).then((category) => {
    category.subcategory.push(body); // updates the subcategory while keeping its schema
    return category.save(); // saves document with subdocuments and triggers validation
  }).then((category) => {
    res.send({ category });
  })
    .catch(e => res.status(400).send(e));
},(e) => {
  console.log("Error in post /category/:id");
});


//patch request to update subcategory
app.patch('/subcategory/:id', (req, res) => {
  let id = req.params.id; //id for subcategory
  let body = _.pick(req.body, ['name', 'position']);

  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  }

  Category.findOne({"subcategory._id":id}).then((category) => {
    const subcategory = category.subcategory.id(req.params.id); // returns a matching subdocument
    subcategory.set(body); // updates the subcategory while keeping its schema
    return category.save(); // saves document with subdocuments and triggers validation
  }).then((category) => {
      res.send({ category });
    })
    .catch(e => res.status(400).send(e));
},(e) => {
  console.log("Error in patch /subcategory/:id");
});


//delete request to delete subcategory
app.delete('/subcategory/:id', (req, res) => {
  const id = req.params.id; //id of subcategory

  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  }

  Category.findOne({"subcategory._id": id}).then((category) => {
    const subcategory = category.subcategory.id(id);
    subcategory.remove();
    return category.save();
  }).then((category) => {
    res.send({ category });
  }).catch(e => res.status(400).send(e));
},(e) => {
  console.log("Error in delete /subcategory/:id");
});


//post request to add items like Samsung, oppo and etc.
app.post('/subcategory/:id', (req, res) => {
  const id = req.params.id; //id of subcategory
  let body = _.pick(req.body, ['name', 'position']);

  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  }

  Category.findOne({"subcategory._id": id}).then((category) => {
    const subcategory = category.subcategory.id(id);
    subcategory.items.push(body);
    return category.save();
  }).then((category) => {
    res.send({ category });
  }).catch(e => res.status(400).send(e));
}, (e) => {
  console.log("Error in post /subcategory/:id");
});


//patch request to update items
app.patch('/item/:id1/:id2', (req, res) => {
  const id1 = req.params.id1; //id of subcategory
  const id2 = req.params.id2; //id of item to be updated
  const body = _.pick(req.body, ['name', 'position']);

  if(!ObjectID.isValid(id1)){
    return res.status(404).send();
  }
  if(!ObjectID.isValid(id2)){
    return res.status(404).send();
  }

  Category.findOne({"subcategory._id": id1}).then((category) => {
    const subcategory = category.subcategory.id(id1);
    const item = subcategory.items.id(id2);
    item.set(body);
    return category.save();
  }).then((category) => {
    res.send({ category });
  }).catch(e => res.status(400).send(e));
},(e) => {
  console.log("Error in patch /item/:id1/:id2");
});


//delete request to delete item
app.delete('/item/:id1/:id2', (req, res) => {
  const id1 = req.params.id1; //id of subcategory
  const id2 = req.params.id2; //id of item to be updated

  if(!ObjectID.isValid(id1)){
    return res.status(404).send();
  }
  if(!ObjectID.isValid(id2)){
    return res.status(404).send();
  }

  Category.findOne({"subcategory._id": id1}).then((category) => {
    const subcategory = category.subcategory.id(id1);
    const item = subcategory.items.id(id2);
    item.remove();
    return category.save();
  }).then((category) => {
    res.send({ category });
  }).catch(e => res.status(400).send(e));
},(e) => {
  console.log("Error in delete /item/:id1/:id2");
});


app.listen(port, () => {
  console.log(`Started on port ${port}`);
});
