/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

let test_thread_id;
let test_thread_id2;
let reply_id;
let password;

chai.use(chaiHttp);

suite('Functional Tests', function() {

  suite('API ROUTING FOR /api/threads/:board', function() {
    
    suite('POST', function() {
      test(`=> create a new thread on 'test' board`, function(done) {
        chai.request(server)
          .post('/api/threads/test')
          .send({
              text : 'Travels',
              delete_password: '12345'
          })
          .end((err, res) => {
              assert.equal(res.status, 200);
              assert.equal(res.type, 'text/html');
              done();
          });
        
      });
    });
    
    suite('GET', function() {
      test('Return recently bumped threads', function(done) {
        chai.request(server)
          .get('/api/threads/test')
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            assert.property(res.body[0], 'reported');
            assert.property(res.body[0], 'replies');
            assert.property(res.body[0], 'replycount');
            assert.property(res.body[0], '_id')
            assert.property(res.body[0], 'text');  
            assert.property(res.body[0], 'created_on');
            assert.property(res.body[0], 'bumped_on');
            assert.property(res.body[0], 'board');
            test_thread_id = res.body[0]._id;
            test_thread_id2 = res.body[1]._id;
            password = res.body[0].delete_password;
            done();
          });
      });
    });

    suite(`PUT`, function() {
      test('=> Report a thread', function(done) {
        chai.request(server)
          .put('/api/threads/test')
          .send({ thread_id: test_thread_id })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, `Successfully reported thread: ${test_thread_id}`);
            done();
          });
      });
    });
    
    suite('DELETE', function() {

      test('=> Delete a thread with wrong password', function(done) {
        chai.request(server)
          .delete('/api/threads/test')
          .send({ 
            thread_id: test_thread_id,
            delete_password: 'wrong-password' 
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, `Incorrect password for ${test_thread_id}`);
            done();
          });
      });

      test('=> Delete a thread with correct password', function(done) {
        chai.request(server)
          .delete('/api/threads/test')
          .send({ 
            thread_id: test_thread_id,
            delete_password: password 
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, `Thread ${test_thread_id} deleted successfully`);
            done();
          });
      });

    });
    
  });
  
  suite('API ROUTING FOR /api/replies/:board', function() {
    
    suite('POST', function() {
      test('Post replies with correct inputs', function(done){
        chai.request(server)
          .post('/api/replies/test')
          .send({
            thread_id: test_thread_id2,
            text: 'Travelling very soon',
            delete_password: '12345'
            })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.type, 'text/html');
            done();
          });
        });
    });
    
    suite('GET', function() {
      test('Get replies with the correct inputs', function(done) {
        chai.request(server)
          .get('/api/replies/test')
          .query({ thread_id: test_thread_id2 })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.type, 'application/json');
            assert.isArray(res.body.replies);
            assert.property(res.body.replies[0], '_id')
            assert.property(res.body.replies[0], 'text')
            assert.property(res.body.replies[0], 'created_on')
            assert.property(res.body.replies[0], 'delete_password')
            assert.property(res.body.replies[0], 'reported')
            assert.isBoolean(res.body.replies[0].reported);
            reply_id = res.body.replies[0]._id;
            reply_id_password = res.body.replies[0].delete_password;
            done(); 
          });
        });
    });
    
    suite('PUT', function() {
      test('Report a reply', function(done){
        chai.request(server)
          .put('/api/replies/test')
          .send({
            thread_id: test_thread_id2,
            reply_id: reply_id
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.type, 'text/html');
            assert.equal(res.text, `Successfully reported ${reply_id}`);
            done();
          })          
        })
    });
    
    suite('DELETE', function() {
      test('=> Delete a reply', function(done) {
        chai.request(server)
          .delete('/api/replies/test')
          .send({
            thread_id: test_thread_id2,
            reply_id: reply_id,
            delete_password: 'password'
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            done();
          });
        });
    });
    
  });

});
