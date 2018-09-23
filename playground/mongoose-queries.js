const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

var id = '5ba7cee4ea32ea7290d18c70';

// if (!ObjectID.isValid(id)) {
//   console.log('>> ID not valid.');
// }

// Todo.find({
//   _id: id
// }).then((todos) => {
//   console.log('Todos', todos);
// })
//
//
// Todo.findOne({
//   _id: id
// }).then((todo) => {
//   console.log('Todo', todo);
// })

// Todo.findById(id).then((todo) => {
//   if (!todo) {
//     return console.log('Id not found.');
//   }
//   console.log('Todo by Id', todo);
// }).catch((err) => {
//   console.log(err);
// })

User.findById(id).then((user) => {
  if (!user) {
    return console.log('User not found.');
  }

  console.log(user);
}).catch((err) => {
  console.log(err);
});
