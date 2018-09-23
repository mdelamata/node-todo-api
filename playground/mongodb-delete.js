// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

// var obj = new ObjectID();
// console.log(obj);

MongoClient.connect('mongodb://localhost:27017/TodoApp', (error, client) => {
  if (error) {
     console.log('>> Error connecting to MongoDB server.');
     return;
  }
  console.log('>> Connected to MongoDB server');

  const db = client.db('TodoApp');

  var todosCollection = db.collection('Todos');

  // todosCollection.deleteMany({text: 'Eat lunch'}).then((result) => {
  //   console.log(result);
  // });

  // todosCollection.deleteOne({text: 'Eat lunch'}).then((result) => {
  //   console.log(result);
  // });

  todosCollection.findOneAndDelete({completed: false}).then((result) => {
    console.log(result);
  });
  db.close();
});
