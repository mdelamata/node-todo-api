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

  var id = '5ba76997a679185617232eaa'
  todosCollection.findOneAndUpdate({
    _id: ObjectID(id)
  }, {
    $set: {
      completed: true
    }
  }, {
    returnOriginal: false
  }).then((result) => {
    console.log(result);
  })



  var todosCollection = db.collection('Users');

  var id = '5ba67f63438f276cec089eec'
  todosCollection.findOneAndUpdate({
    _id: ObjectID(id)
  }, {
    $set: {
      name: 'Aunshi'
    },
    $inc: {
      age: 1
    }
  }, {
    returnOriginal: false
  }).then((result) => {
    console.log(result);
  })


  db.close();
});
