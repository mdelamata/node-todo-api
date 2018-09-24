const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

var id = '5ba7cee4ea32ea7290d18c70';

// Todo.remove({}).then((res) => {
//   console.log(res);
// }).catch((err) => {
//
// });
//
//
//
// Todo.findOneAndRemove({text: ''}).then((todo) => {
//   console.log(todo);
// }).catch((err) => {
//
// });
//
//
//
// Todo.findByIdAndRemove('').then((todo) => {
//   console.log(todo);
// }).catch((err) => {
//
// });
