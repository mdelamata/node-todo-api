const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');


const {app} = require('./../server')
const {Todo} = require('./../models/todo')
const {User} = require('./../models/user')
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {

  it('should create a new todo', (done) => {
    var text = "Test todo text";

    request(app)
      .post('/todos')
      .send({text})
      .set('x-auth', users[0].tokens[0].token)
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
      .set('x-auth', users[0].tokens[0].token)
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
          .set('x-auth', users[0].tokens[0].token)
          .expect(200)
          .expect((res) => {
              expect(res.body.todos.length).toBe(1)
          })
          .end(done);
    });
});

describe('GET /todos/:id', () => {

  it('should return todo doc', (done) => {

      var id = todos[0]._id.toHexString();

      request(app)
        .get(`/todos/${id}`)
        .set('x-auth', users[0].tokens[0].token)
        .expect(200)
        .expect((res) => {
          expect(res.body.todo._id).toBe(id);
        })
        .end(done);
  });

  it('should not return todo doc created by other user', (done) => {

      var id = todos[1]._id.toHexString();

      request(app)
        .get(`/todos/${id}`)
        .set('x-auth', users[0].tokens[0].token)
        .expect(404)
        .end(done);
  });


  it('should return a 404 when not found', (done) => {

      request(app)
        .get(`/todos/${new ObjectID().toHexString()}}`)
        .set('x-auth', users[0].tokens[0].token)
        .expect(404)
        .end(done);
  });

  it('should return a 404 when id is not valid', (done) => {

      request(app)
        .get('/todos/12')
        .set('x-auth', users[0].tokens[0].token)
        .expect(404)
        .end(done);
  });
});


describe('DELETE /todos/:id', () => {

    it('should remove a todo', (done) => {
        var id = todos[1]._id.toHexString()

        request(app)
          .delete(`/todos/${id}`)
          .set('x-auth', users[1].tokens[0].token)
          .expect(200)
          .expect((res) => {
            expect(res.body.todo._id).toBe(id);
          })
          .end((err, res) => {
            if (err) {
              return done(err);
            }

            Todo.findById(id).then((todo) => {
              expect(todo).toBe(null);
              done();
            }).catch((e) => done(e));
          });
    });

    it('should not remove a todo created by another user', (done) => {
        var id = todos[0]._id.toHexString()

        request(app)
          .delete(`/todos/${id}`)
          .set('x-auth', users[1].tokens[0].token)
          .expect(404)
          .end((err, res) => {
            if (err) {
              return done(err);
            }

            Todo.findById(id).then((todo) => {
              expect(todo).not.toBe(null);
              done();
            }).catch((e) => done(e));
          });
    });

    it('should return a 404 if todo not found', (done) => {
      request(app)
        .delete(`/todos/${new ObjectID().toHexString()}}`)
        .set('x-auth', users[0].tokens[0].token)
        .expect(404)
        .end(done);
    });

    it('should return a 404 if id is not valid', (done) => {
      request(app)
        .delete(`/todos/12a`)
        .set('x-auth', users[0].tokens[0].token)
        .expect(404)
        .end(done);
    });
});


describe('PATCH /todos/:id', () => {

  it('should update the todo', (done) => {

      var id = todos[0]._id.toHexString();
      var text = 'This should be the new text';
      request(app)
        .patch(`/todos/${id}`)
        .set('x-auth', users[0].tokens[0].token)
        .send({
          completed: true,
          text
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.todo.completedAt).toBeDefined();
          expect(res.body.todo.completed).toBe(true);
          expect(res.body.todo.text).toBe(text);
        }).end((err, res) => {

          if (err) {
            return done(err);
          }

          Todo.findById(id).then((todo) => {
            expect(todo.completedAt).toBeDefined();
            expect(todo.completed).toBe(true);
            expect(todo.text).toBe(text);
            done();
          }).catch( e => done(e) );
        });


  });


  it('should not update the todo of another user', (done) => {

      var id = todos[0]._id.toHexString();
      var text = 'This should be the new text';
      request(app)
        .patch(`/todos/${id}`)
        .set('x-auth', users[1].tokens[0].token)
        .send({
          completed: true,
          text
        })
        .expect(404)
        .end((err, res) => {

          if (err) {
            return done(err);
          }

          Todo.findById(id).then((todo) => {
            expect(todo.completedAt).toBe(null);
            expect(todo.completed).toBe(false);
            done();
          }).catch( e => done(e) );
        });


  });


  it('should clear completedAt when a todo is completed', (done) => {

    var id = todos[1]._id.toHexString();

    request(app)
      .patch(`/todos/${id}`)
      .set('x-auth', users[1].tokens[0].token)
      .send({
        completed: false
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.completedAt).toBe(null);
        expect(res.body.todo.completed).toBe(false);
      }).end((err, res) => {

        if (err) {
          return done(err);
        }

        Todo.findById(id).then((todo) => {
          expect(todo.completedAt).toBe(null);
          expect(todo.completed).toBe(false);
          done();
        }).catch( e => done(e) );
      });

  });

  it('should return a 404 if todo not found', (done) => {
    request(app)
      .patch(`/todos/${new ObjectID().toHexString()}}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('should return a 404 if id is not valid', (done) => {
    request(app)
      .patch(`/todos/12a`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });
});



describe('GET /users/me', () => {

    it('should return user if authenticated', (done) => {
        request(app)
          .get('/users/me')
          .set('x-auth', users[0].tokens[0].token)
          .expect(200)
          .expect((res) => {
              expect(res.body._id).toBe(users[0]._id.toHexString());
              expect(res.body.email).toBe(users[0].email);
          })
          .end(done);
    });

    it('should return a 401 if not authenticated', (done) => {

      request(app)
        .get('/users/me')
        .set('x-auth', 'wrongToken')
        .expect(401)
        .expect((res) => {
            expect(res.body).toEqual({});
        })
        .end(done);
    });
});


describe('POST /users', () => {

  it('should create a user', (done) => {

    var email = 'newUser@email.com'
    var password = 'manuel'
    var id


    request(app)
      .post('/users')
      .send({email, password})
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toBeDefined();
        expect(res.body._id).toBeDefined();
        expect(res.body.email).toEqual(email);
        id = res.body._id
      })
      .end((err, res) => {

          if (err) {
            return done(err);
          }

          User.findById(id).then((user) => {
              expect(user).toBeDefined();
              expect(user.password).not.toBe(password);
              expect(user.email).toEqual(email)
              done();
          }).catch((e) => done(e));

      });

  });


  it('should return validation errors if request invalid', (done) => {

        var invalidEmail = 'newUser@e'
        var password = 'manuel'

        request(app)
          .post('/users')
          .send({email: invalidEmail, password})
          .expect(400)
          .end(done);

  });

  it('should not create user if email in use', (done) => {

    var usedEmail = users[0].email
    var password = 'manuel'

    request(app)
      .post('/users')
      .send({email: usedEmail, password})
      .expect(400)
      .end(done);

  });
});


describe('POST /users/login', () => {

    it('should login user and return auth token', (done) => {

      var email = users[1].email
      var password = users[1].password

      request(app)
        .post('/users/login')
        .send({email, password})
        .expect(200)
        .expect((res) => {
            expect(res.headers['x-auth']).toBeDefined();
            expect(res.body.email).toBe(email);
        })
        .end((err, res) => {

            if(err) {
              return done(err);
            }

            User.findById(users[1]._id).then((user) => {
              expect(user.tokens[1]).toMatchObject({
                access: 'auth',
                token: res.headers['x-auth']
              });
              done();
            }).catch((e) => done(e));

        });

    });

    it('should reject invalid login', (done) => {
      var email = users[0].email
      var password = 'password'

      request(app)
        .post('/users/login')
        .send({email, password})
        .expect(400)
        .end(done);
    });
});


describe('DELETE /users/me/token', () => {

    it('should remove auth token on logout', (done) => {


        request(app)
          .delete('/users/me/token')
          .set('x-auth', users[0].tokens[0].token)
          .expect(200)
          .end( (err, res) => {

              if (err) {
                return done(err);
              }

              User.findById(users[0]._id).then((user) => {

                expect(user.tokens).not.toMatchObject({
                  access: 'auth',
                  token: res.headers['x-auth']
                })
                done();
              }).catch((e) => done(e));

          });
    });


});
