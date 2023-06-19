/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const assertionAnalyser = require('../assertion-analyser');
const common = require('mocha/lib/interfaces/common');

chai.use(chaiHttp);

after (function () {
  chai.request(server).get('/api')
})

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  // test('#example Test GET /api/books', function(done){
  //    chai.request(server)
  //     .get('/api/books')
  //     .end(function(err, res){
  //       assert.equal(res.status, 200);
  //       assert.isArray(res.body, 'response should be an array');
  //       assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
  //       assert.property(res.body[0], 'title', 'Books in array should contain title');
  //       assert.property(res.body[0], '_id', 'Books in array should contain _id');
  //       done();
  //     });
  // });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {
    let idMarker
    let titleMarker = "title 1"

    suite('POST /api/books with title => create book object/expect book object', function() {

      test('Test POST /api/books with title', function(done) {
        chai.request(server)
        .post('/api/books')
        .send({
          title: titleMarker
        })
        .end((err, res) => {
          idMarker = res.body._id
          assert.equal(res.status, 200)
          assert.isObject(res.body)
          assert.property(res.body, "title")
          assert.equal(res.body.title, "title 1")
          assert.property(res.body, "_id")
          done()
        })
      });

      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
        .post('/api/books')
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.isString(res.text)
          assert.equal(res.text, "missing required field title")
          done()
        })
      });

    });


    suite('GET /api/books => array of books', function(){

      test('Test GET /api/books',  function(done){
        chai.request(server)
        .get('/api/books')
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.isArray(res.body)
          assert.property(res.body[0], "commentcount")
          assert.property(res.body[0], "title")
          assert.property(res.body[0], "comments")
          assert.isArray(res.body[0].comments)
          done()
        })
      });

    });


    suite('GET /api/books/[id] => book object with [id]', function(){

      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai.request(server)
        .get(`/api/books/00000000000000000000000000`)
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.isString(res.text)
          assert.equal(res.text, "no book exists")
          done()
        })
      });

      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai.request(server)
        .get(`/api/books/${idMarker}`)
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.isObject(res.body)
          assert.property(res.body, "title")
          assert.property(res.body, "comments")
          assert.isArray(res.body.comments)
          assert.property(res.body, "commentcount")
          assert.isNumber(res.body.commentcount)
          assert.equal(res.body._id, idMarker)
          done()
        })
      });

    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){

      test('Test POST /api/books/[id] with comment', function(done){
        chai.request(server)
        .post(`/api/books/${idMarker}`)
        .send({
          id: idMarker,
          comment: "what a book"
        })
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.isObject(res.body)
          assert.property(res.body, "title")
          assert.equal(res.body.title, titleMarker)
          assert.property(res.body, "_id")
          assert.equal(res.body._id, idMarker)
          assert.property(res.body, "commentcount")
          assert.isNumber(res.body.commentcount)
          assert.equal(res.body.commentcount, res.body.comments.length)
          assert.property(res.body, "comments")
          assert.isArray(res.body.comments)
          assert.isTrue(res.body.comments.includes("what a book"))
          done()
        })
      });

      test('Test POST /api/books/[id] without comment field', function(done){
        chai.request(server)
        .post(`/api/books/${idMarker}`)
        .send({
          id: idMarker
        })
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.isString(res.text)
          assert.equal(res.text, "missing required field comment")
          done()
        })
      });

      test('Test POST /api/books/[id] with comment, id not in db', function(done){
        chai.request(server)
        .post(`/api/books/${00000000000000000000000000}`)
        .send({
          comment: "does this book exists"
        })
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.isString(res.text)
          assert.equal(res.text, "no book exists")
          done()
        })
      });

    });

    suite('DELETE /api/books/[id] => delete book object id', function() {

      test('Test DELETE /api/books/[id] with valid id in db', function(done){
        //done();
      });

      test('Test DELETE /api/books/[id] with  id not in db', function(done){
        //done();
      });

    });

  });

});
