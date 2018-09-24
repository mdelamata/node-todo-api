const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');


const {app} = require('./../server')
const {Todo} = require('./../models/todo')

const todos = [{
  _id: new ObjectID(),
  text: 'First'
},
 {
   _id: new ObjectID(),
   text: 'Second'
 }
];

beforeEach((done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);
  }).then(() => done());
});

describe('POST /todos', () => {

  it('should create a new todo', (done) => {
    var text = "Test todo text";

    request(app)
      .post('/todos')
      .send({text})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find({text}).then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((e) => done(e));
      });
  });

  it('should not create todo with invalid body data', (done) => {

    var text = "";

    request(app)
      .post('/todos')
      .send({text})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find().then( (todos) => {
          expect(todos.length).toBe(2);
          done();
        }).catch( (e) => done(e));

      });
  });
});


describe('GET /todos', () => {
    it('should get all todos', (done) => {
        request(app)
          .get('/todos')
          .expect(200)
          .expect((res) => {
              expect(res.body.todos.length).toBe(2)
          })
          .end(done);
    });
});

describe('GET /todos/:id', () => {

  it('should return todo doc', (done) => {

      var id = todos[0]._id.toHexString();

      request(app)
        .get(`/todos/${id}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.todo._id).toBe(id);
        })
        .end(done);
  });

  it('should return a 404 when not found', (done) => {

      request(app)
        .get(`/todos/${new ObjectID().toHexString()}}`)
        .expect(404)
        .end(done);
  });

  it('should return a 404 when id is not valid', (done) => {

      request(app)
        .get('/todos/12')
        .expect(404)
        .end(done);
  });
});
