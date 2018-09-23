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

  todosCollection.find().toArray().then((docs) => {
    console.log('Todos');
    console.log(JSON.stringify(docs, undefined, 2));
  }, (error) => {
    console.log('>> Error: Unable to fetch todos');
  });

  todosCollection.find({completed: true}).toArray().then((docs) => {
    console.log('>> Todos');
    console.log(JSON.stringify(docs, undefined, 2));
  }, (error) => {
    console.log('>> Error: Unable to fetch todos');
  });

  todosCollection.find().count().then((count) => {
    console.log('>> count:', count);
  }, (error) => {
    console.log('>> Error: Unable to fetch todos');
  });


  var usersCollection = db.collection('Users');

  usersCollection.find({name: 'Manuel'}).toArray().then((users) => {
    console.log('>> Users');
    console.log(JSON.stringify(users, undefined, 2));
  }, (error) => {
    console.log('>> Error: Unable to fetch users');
  });

  usersCollection.find({name: 'Manuel'}).count().then((count) => {
    console.log('>> User count:', count);
  }, (error) => {
    console.log('>> Error: Unable to fetch users');
  });

  db.close();
});
