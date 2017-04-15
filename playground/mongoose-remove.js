const {ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');

Todo.remove({}).then((resilt) => {
  console.log(result);
});

Todo.findOneAndRemove({_id: '123'}).then((todo) => {
  console.log(todo);
})

Todo.findByIdAndRemove('123').then((todo) => {
  console.log(todo);
});
