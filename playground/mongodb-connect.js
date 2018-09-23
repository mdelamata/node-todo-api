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

  // db.collection('Todos').insertOne({
  //   text: "Something to do",
  //   completed: false
  // }, (error, result) => {
  //   if (error) {
  //     return console.log('>> Error: Unable to insert todo', error);
  //   }
  //
  //   console.log(JSON.stringify(result.ops, undefined, 2));
  //
  // });


  // const usersCollection = db.collection('Users')
  //
  // usersCollection.insertOne(
  //   {
  //     name: 'Manuel',
  //     age: 31,
  //     location: 'London',
  //     country: 'UK'
  //   }
  // , (error, result) => {
  //     if (error) {
  //       return console.log('>> Error: Unable to insert user.', error);
  //     }
  //     // console.log(JSON.stringify(result.ops, undefined, 2));
  //     console.log(result.ops[0]._id.getTimestamp());
  //
  // });


  db.close();
});
