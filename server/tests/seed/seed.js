const {ObjectID} = require('mongodb');

const {Todo} = require('./../../models/todo');


const todos = [{
  _id: new ObjectID(),
  text: 'First',
},
 {
   _id: new ObjectID(),
   text: 'Second',
   completed: true,
   completedAt: 444
 }
];


const populateTodos = (done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);
  }).then(() => done());
};


module.exports = {todos, populateTodos};
