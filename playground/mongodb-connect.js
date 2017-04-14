// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('Mongodb');

// var obj = new ObjectID();
// console.log(obj);

// // ES6 object destructuring
// var user = {name: 'Chris', age: 45};
// var {name} = user; // => name = 'Chris'


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');

  // db.collection('Todos').insertOne({
  //   text: 'Something to do',
  //   completed: false
  // }, (err, result) => {
  //   if (err) {
  //     return console.log('Unable to insert todo', err);
  //   }
  //
  //   console.log(JSON.stringify(result.ops, undefined, 2));
  //   // result.ops._id.getTimestamp()
  // });

  db.close();
});
