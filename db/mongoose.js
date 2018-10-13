let mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.PROD_MONGODB || 'mongodb://localhost:27017/Product',{useNewUrlParser: true}).then(() => console.log('Successfully connected to mongoDB server.'));

module.exports = {mongoose};